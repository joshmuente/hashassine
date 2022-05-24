import { Injectable } from '@angular/core';
import { NearService } from './near.service';
import * as nearAPI from "near-api-js";
import { map, mergeMap, Observable, tap} from 'rxjs';

const contractName = 'otter-hash.joshmuente.testnet';

@Injectable({
  providedIn: 'root'
})
export class HashassineContractService extends NearService {
  public challangeList: any;

  public contract: Observable<any> = this.wallet.pipe(
    map(wallet => {
      return new nearAPI.Contract(wallet.account(), contractName, {
        viewMethods: ["get_added_challenges", "get_challenge_amount"],
        changeMethods: ["add_challenge", "claim_reward"],
      });
    })
  )

  public getChallengeAmount(): Observable<number> {
    return this.contract.pipe(
      mergeMap(contract => contract.get_challenge_amount() as Observable<number>)
    )
  }

  public getAddedChallenges(fromIndex: number, limit: number) {
    this.challangeList = this.contract.pipe(
      mergeMap(contract => contract.get_added_challenges({ from_index: fromIndex, limit: limit }))
    )
  }

  public addChallenge(hash: string, hashType: "Md5" | "Sha1") {
    console.log(hash, hashType)
    return this.contract.pipe(
      mergeMap(contract => contract.add_challenge({ hash: hash, hash_type: hashType })),
      tap(() => {
        this.getAddedChallenges(0, 10)
      })
    )
  }

  public submitSolution(id: number, solution: string) {
    return this.contract.pipe(
      mergeMap(contract => contract.claim_reward({ id: id, solution: solution }))
    )
  }
}
