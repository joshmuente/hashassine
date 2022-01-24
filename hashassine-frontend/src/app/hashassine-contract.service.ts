import { Injectable } from '@angular/core';
import { NearService } from './near.service';
import * as nearAPI from "near-api-js";
import { map, mergeMap, Observable, withLatestFrom } from 'rxjs';

const contractName = 'otter-hash.joshmuente.testnet';

@Injectable({
  providedIn: 'root'
})
export class HashassineContractService {
  private contract: Observable<any> = this.nearService.connect().pipe(
    map(connection => {
      return new nearAPI.Contract(connection.account(), contractName, {
        viewMethods: ["get_added_challenges"],
        changeMethods: ["add_challenge"]
      });
    })
  )

  constructor(private nearService: NearService) {
  }

  public getAddedChallenges(fromIndex: number, limit: number): Observable<[any]> {
    return this.contract.pipe(
      mergeMap(contract => contract.get_added_challenges({ from_index: fromIndex, limit: limit }) as [])
    )
  }

  public signIn() {
    return this.nearService.connect().pipe(
      withLatestFrom(this.contract),
      map(([wallet, contract]) => wallet.requestSignIn(
        { contractId: contractName, methodNames: [contract.add_challenge.name] })
      )
    ).subscribe()
  }

  public addChallenge(hash: string, hashType: "Md5" | "Sha1") {
    return this.contract.pipe(
      mergeMap(contract => contract.add_challenge({ hash: hash, hash_type: hashType, account_id: "joshmuente.testnet" }))
    )
  }
}
