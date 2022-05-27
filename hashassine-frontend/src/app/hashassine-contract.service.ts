import { Injectable } from '@angular/core';
import { NearService } from './near.service';
import * as nearAPI from "near-api-js";
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, Observer, shareReplay, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contract } from 'near-api-js';

interface IHashassine extends Contract {
  get_added_challenges({ }): Observable<[]>,
  get_challenge_amount(): Observable<number>,
  add_challenge({ }): Observable<[]>,
  claim_reward({ }): Observable<any>,
  get_challenges_by_user({ }): Observable<any>,
  remove_challenge({}): Observable<any>
}

@Injectable({
  providedIn: 'root'
})
export class HashassineContractService extends NearService {

  constructor() {
    super();
  }

  public contract: Observable<IHashassine> = this.walletConnection.pipe(
    map(walletConnection => {
      return new nearAPI.Contract(
        walletConnection.account(),
        environment.contract,
        {
          viewMethods: ["get_added_challenges", "get_challenge_amount", "get_challenges_by_user"],
          changeMethods: ["add_challenge", "claim_reward", "remove_challenge"],
        }) as IHashassine;
    })
  )

  public challangeAmount = combineLatest([this.contract, this.update$]).pipe(mergeMap(([contract, update]) => contract.get_challenge_amount()));

  public removeChallange(id: number) {
    this.loading$.next(true);
    this.contract.pipe(
      mergeMap(contract => contract.remove_challenge({ id: id }))
    ).subscribe(() => {
      this.loading$.next(false);
      this.update$.next(false);
    })
  }

  public getAddedChallenges(fromIndex: number, limit: number) {
    return combineLatest([this.contract, this.update$]).pipe(
      mergeMap(([contract, update]) => contract.get_added_challenges({ from_index: fromIndex, limit: limit }))
    );
  }

  public addChallenge(hash: string, hashType: "Md5" | "Sha1") {
    this.loading$.next(true)
    this.contract.pipe(
      mergeMap(contract => contract.add_challenge({ hash: hash, hash_type: hashType }))
    ).subscribe(() => {
      this.loading$.next(false);
      this.update$.next(false);
    }
    )
  }

  public submitSolution(id: number, solution: string) {
    this.loading$.next(true);
    this.contract.pipe(
      mergeMap(contract => contract.claim_reward({ id: id, solution: solution }))
    ).subscribe(
      () => {
        this.loading$.next(false);
        this.update$.next(false)
      }
    )
  }

  public getMyChallenges() {
    return combineLatest([this.contract, this.accountId, this.update$]).pipe(
      mergeMap(([contract, accountId, update]) => contract.get_challenges_by_user({ account: accountId }))
    )
  }

  public signIn() {
    this.loading$.next(true)
    combineLatest([this.walletConnection, this.contract]).pipe(
      mergeMap(([walletConnection, contract]) => {
        return walletConnection.requestSignIn(
          { contractId: environment.contract, methodNames: ["add_challenge", "claim_reward", "remove_challenge"]},
          environment.contract
        );
      })
    ).subscribe(() => this.loading$.next(false))
  };
}
