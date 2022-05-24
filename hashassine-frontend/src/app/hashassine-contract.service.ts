import { Injectable } from '@angular/core';
import { NearService } from './near.service';
import * as nearAPI from "near-api-js";
import { map, mergeMap, Observable} from 'rxjs';

const contractName = 'otter-hash.joshmuente.testnet';

@Injectable({
  providedIn: 'root'
})
export class HashassineContractService extends NearService {
  public contract: Observable<any> = this.wallet.pipe(
    map(wallet => {
      return new nearAPI.Contract(wallet.account(), contractName, {
        viewMethods: ["get_added_challenges"],
        changeMethods: ["add_challenge", "claim_reward"],
      });
    })
  )

  public getAddedChallenges(fromIndex: number, limit: number): Observable<[any]> {
    return this.contract.pipe(
      mergeMap(contract => contract.get_added_challenges({ from_index: fromIndex, limit: limit }) as [])
    )
  }

  public addChallenge(hash: string, hashType: "Md5" | "Sha1") {
    console.log(hash, hashType)
    return this.contract.pipe(
      mergeMap(contract => contract.add_challenge({ hash: hash, hash_type: hashType }))
    )
  }

  public submitSolution(id: number, solution: string) {
    return this.contract.pipe(
      mergeMap(contract => contract.claim_reward({ id: id, solution: solution }))
    )
  }
}
