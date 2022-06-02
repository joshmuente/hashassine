import { Injectable } from '@angular/core';
import { NearService } from './near.service';
import * as nearAPI from "near-api-js";
import { BehaviorSubject, combineLatest, filter, map, mergeMap, Observable, Observer, shareReplay, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contract } from 'near-api-js';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IHashassine extends Contract {
  get_added_challenges({ }): Observable<ChallangeMap>,
  get_challenge_amount(): Observable<number>,
  add_challenge({ }): Observable<[]>,
  claim_reward({ }): Observable<any>,
  get_challenges_by_user(args: {}): Observable<any>,
  remove_challenge({ }): Observable<any>,
  add_challenge_reward(args: {}, gas?: number, deposit?: string): Observable<any>,
  remove_challenge_reward(args: {}): Observable<any>
}

export type hash = "Md5" | "Sha1"

export type ChallengeFilterBy = "Solved" | "Unsolved";

type Challange = {
  added_by: string,
  hash: string,
  hash_type: hash,
  amount: number,
  solution?: string,
  cracked_by?: string
}

export type ChallangeMap  = {
  [key: number]: Challange
}

export type ChallangeResponse = [number, ChallangeMap]

@Injectable({
  providedIn: 'root'
})
export class HashassineContractService {

  constructor(private nearService: NearService, private snackbar: MatSnackBar) { }

  public contract: Observable<IHashassine> = this.nearService.walletConnection.pipe(
    map(walletConnection => {
      return new nearAPI.Contract(
        walletConnection.account(),
        environment.contract,
        {
          viewMethods: ["get_added_challenges", "get_challenge_amount", "get_challenges_by_user"],
          changeMethods: ["add_challenge", "claim_reward", "remove_challenge", "add_challenge_reward", "remove_challenge_reward"],
        }) as IHashassine;
    })
  )

  public challangeAmount = combineLatest([this.contract, this.nearService.update$]).pipe(mergeMap(([contract, update]) => contract.get_challenge_amount()));

  public removeChallenge(id: number) {
    this.nearService.loading$.next(true);
    this.contract.pipe(
      mergeMap(contract => contract.remove_challenge({ id: id }))
    ).subscribe(
      {complete: () => {
        this.nearService.loading$.next(false);
        this.nearService.update$.next(true);
      }, error: (err) => {
        this.nearService.loading$.next(false);
        this.snackbar.open(err)
      }}
    )
  }

  public addChallangeReward(id: number, amount: string) {
    this.nearService.loading$.next(true)
    return this.contract.pipe(
      mergeMap(contract => contract.add_challenge_reward({ id: id }, undefined, amount))
    ).subscribe(
      {complete: () => {
        this.nearService.loading$.next(false);
        this.nearService.update$.next(true);
      }, error: (err) => {
        this.nearService.loading$.next(false);
        this.snackbar.open(err)
      }}
    )
  }

  public removeChallengeReward(id: number, amount: string) {
    this.nearService.loading$.next(true)
    return this.contract.pipe(
      mergeMap(contract => contract.remove_challenge_reward({ id: id, amount: amount}))
    ).subscribe(
      {complete: () => {
        this.nearService.loading$.next(false);
        this.nearService.update$.next(true);
      }, error: (err) => {
        this.nearService.loading$.next(false);
        this.snackbar.open(err)
      }}
    )
  }

  public getAddedChallenges(fromIndex: number, limit: number, filter_by?: ChallengeFilterBy) {
    return combineLatest([this.contract, this.nearService.update$]).pipe(
      mergeMap(([contract, update]) => contract.get_added_challenges({ from_index: fromIndex, limit: limit, filter_by: filter_by }))
    );
  }

  public addChallenge(hash: string, hashType: "Md5" | "Sha1") {
    this.nearService.loading$.next(true)
    this.contract.pipe(
      mergeMap(contract => contract.add_challenge({ hash: hash, hash_type: hashType }))
    ).subscribe(
      {complete: () => {
        this.nearService.loading$.next(false);
        this.nearService.update$.next(true);
      }, error: (err) => {
        this.nearService.loading$.next(false);
        this.snackbar.open(err)
      }}
    )
  }

  public submitSolution(id: number, solution: string) {
    this.nearService.loading$.next(true);
    this.contract.pipe(
      mergeMap(contract => contract.claim_reward({ id: id, solution: solution }))
    ).subscribe(
      {complete: () => {
        this.nearService.loading$.next(false);
        this.nearService.update$.next(true);
      }, error: (err) => {
        this.nearService.loading$.next(false);
        this.snackbar.open(err)
      }}
    )
  }

  public getMyChallenges(from: number, limit: number): Observable<ChallangeResponse> {
    return combineLatest([this.contract, this.nearService.accountId, this.nearService.update$]).pipe(
      mergeMap(([contract, accountId, update]) => contract.get_challenges_by_user({ from_index: from, limit: limit, account: accountId }))
    )
  }

  public signIn() {
    this.nearService.loading$.next(true)
    combineLatest([this.nearService.walletConnection, this.contract]).pipe(
      mergeMap(([walletConnection, contract]) => {
        return walletConnection.requestSignIn(
          { contractId: environment.contract, methodNames: ["add_challenge", "claim_reward", "remove_challenge", "add_challenge_reward", "remove_challenge_reward"] },
          environment.contract
        );
      })
    ).subscribe(() => this.nearService.loading$.next(false))
  };
}
