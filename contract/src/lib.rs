extern crate near_sdk;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::env;
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{near_bindgen, AccountId, Balance, BorshStorageKey, PanicOnDefault, Promise};
use regex::Regex;
use std::collections::HashMap;
type ChallengeId = u128;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum HashType {
    Md5,
    Sha1,
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Challenges,
    ChallengesFromUser,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    challenge_counter: u128,
    challenge_list: UnorderedMap<ChallengeId, Challenge>,
    challenges_from_user: UnorderedMap<AccountId, Vec<ChallengeId>>,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Challenge {
    added_by: AccountId,
    hash: String,
    hash_type: HashType,
    amount: Balance,
}

// TODO: is challenge_counter the right way? what about overflows?
#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::predecessor_account_id(),
            challenge_counter: 0,
            challenge_list: UnorderedMap::new(StorageKeys::Challenges),
            challenges_from_user: UnorderedMap::new(StorageKeys::ChallengesFromUser),
        }
    }

    fn assert_validate_hash(hash: &String, hash_type: &HashType) {
        let regex: Regex;
        match hash_type {
            HashType::Md5 => {
                regex = Regex::new(r"^[a-f0-9]{32}$").unwrap();
            }
            HashType::Sha1 => {
                regex = Regex::new(r"\b[0-9a-f]{5,40}\b").unwrap();
            }
        }
        assert!(regex.is_match(&hash));
    }

    #[payable]
    pub fn add_challenge(&mut self, hash: String, hash_type: HashType) {
        Contract::assert_validate_hash(&hash, &hash_type);
        let amount = env::attached_deposit();
        let added_by = env::predecessor_account_id();
        let id: ChallengeId = self.challenge_counter + 1;
        let added_by_c = added_by.clone();
        self.challenge_list.insert(
            &id,
            &Challenge {
                added_by,
                hash,
                hash_type,
                amount,
            },
        );
        match self.challenges_from_user.get(&added_by_c) {
            Some(mut value) => {
                value.push(id);
                self.challenges_from_user.insert(&added_by_c, &value);
            }
            None => {
                let data_vec = vec![id];
                self.challenges_from_user.insert(&added_by_c, &data_vec);
            }
        }
        self.challenge_counter = id;
    }

    #[payable]
    pub fn add_challenge_reward(&mut self, id: ChallengeId) {
        let amount = env::attached_deposit();
        assert!(amount > 0);
        let mut challenge = self.get_challenge(id);
        assert!(env::predecessor_account_id() == challenge.added_by);
        let new_amount = challenge.amount + amount;
        challenge.amount = new_amount;
        self.challenge_list.insert(&id, &challenge);
    }

    pub fn remove_challenge_reward(&mut self, id: ChallengeId, amount: U128) -> Promise {
        let mut challenge = self.get_challenge(id);
        let amount_u: u128 = amount.into();
        assert!(env::predecessor_account_id() == challenge.added_by);
        assert!(challenge.amount >= amount_u);
        challenge.amount = challenge.amount - amount_u;
        self.challenge_list.insert(&id, &challenge);
        Contract::pay(env::predecessor_account_id(), amount_u)
    }

    pub fn remove_challenge(&mut self, id: ChallengeId) -> Promise {
        let challenge = self.get_challenge(id);
        assert!(
            env::predecessor_account_id() == challenge.added_by
                || env::predecessor_account_id() == self.owner_id
        );
        match self
            .challenges_from_user
            .get(&env::predecessor_account_id())
        {
            Some(mut challenges) => {
                challenges.retain(|&x| x != id);
                self.challenges_from_user
                    .insert(&challenge.added_by, &challenges);
            }
            None {} => {}
        }
        self.challenge_list.remove(&id);
        Contract::pay(challenge.added_by, challenge.amount)
    }

    pub fn get_added_challenges(
        &self,
        from_index: u64,
        limit: u64,
    ) -> HashMap<ChallengeId, Challenge> {
        let ids = self.challenge_list.keys_as_vector();
        let challenges = self.challenge_list.values_as_vector();
        (from_index..std::cmp::min(from_index + limit, self.challenge_list.len()))
            .map(|index| (ids.get(index).unwrap(), challenges.get(index).unwrap()))
            .collect()
    }

    pub fn get_challenges_by_user(
        &self,
        account: AccountId,
        from_index: u64,
        limit: u64,
    ) -> (usize, HashMap<ChallengeId, Challenge>) {
        match self.challenges_from_user.get(&account) {
            Some(challenge_ids) => {
                let ids = challenge_ids;
                let challenges: Vec<Challenge> = ids.iter().map(|&x| self.get_challenge(x)).collect();
                let paginated: HashMap<ChallengeId, Challenge> = (from_index..std::cmp::min(from_index + limit, challenges.len() as u64))
                    .map(|index| (ids.get(index as usize).unwrap().clone(), challenges.get(index as usize).unwrap().clone()))
                    .collect();
                return (challenges.len(), paginated);
            },
            None => { (0, HashMap::new()) }
        }
    }

    pub fn get_challenge_amount(&self) -> u64 {
        return self.challenge_list.len();
    }

    pub fn claim_reward(&mut self, id: ChallengeId, solution: String) -> Promise {
        let challenge: Challenge = self.get_challenge(id);
        Contract::assert_solution_correct(challenge.clone(), solution);
        self.challenge_list.remove(&id);
        match self.challenges_from_user.get(&challenge.added_by) {
            Some(mut challenges) => {
                challenges.retain(|&x| x != id);
                self.challenges_from_user
                    .insert(&challenge.added_by, &challenges);
            }
            None {} => {}
        }
        Contract::pay(env::predecessor_account_id(), challenge.amount)
    }

    fn get_challenge(&self, id: ChallengeId) -> Challenge {
        let challenge = self
            .challenge_list
            .get(&id)
            .expect("Challenge ID doesn't exist");
        return challenge;
    }

    fn hash(string: String, hash_type: HashType) -> String {
        let computed_hash: String = match hash_type {
            HashType::Md5 => format!("{:x}", md5::compute(string)),
            HashType::Sha1 => {
                let mut m = sha1_smol::Sha1::new();
                m.update(string.as_bytes());
                m.digest().to_string()
            }
        };
        return computed_hash;
    }

    pub fn clear(&mut self) {
        assert!(env::predecessor_account_id() == self.owner_id);
        self.challenge_counter = 0;
        self.challenge_list.clear();
        self.challenges_from_user.clear()
    }

    fn assert_solution_correct(challenge: Challenge, solution: String) {
        let solution_hash = Contract::hash(solution, challenge.hash_type);
        assert!(solution_hash.eq(&challenge.hash))
    }

    fn pay(user: AccountId, amount: Balance) -> Promise {
        Promise::new(user).transfer(amount)
    }
}
