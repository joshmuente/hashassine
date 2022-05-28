import { DOCUMENT } from '@angular/common';
import { Injectable } from '@angular/core';
import * as nearAPI from "near-api-js";
import { BehaviorSubject, combineLatest, from, map, mergeMap, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../environments/environment';
const nearConfig = {
  headers: {},
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org'
};

@Injectable({
  providedIn: 'root'
})
export class NearService {
  public loading$ = new BehaviorSubject(false);
  public update$ = new BehaviorSubject(true);

  private near = from(nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  }))

  public walletConnection = this.near.pipe(
    map((connection) => new nearAPI.WalletConnection(connection, environment.contract)),
    shareReplay()
  );

  public accountId: Observable<String> = combineLatest([this.walletConnection, this.update$]).pipe(
    map(([walletConnection, update]) => walletConnection.getAccountId())
  )

  public isLoggedIn = combineLatest([this.walletConnection, this.update$]).pipe(
    map(([walletConnection, update]) => walletConnection.isSignedIn()),
  )

  public balance$: Observable<string> = combineLatest([this.near, this.walletConnection, this.update$]).pipe(
    mergeMap(([near, walletConnection, update]) => near.account(walletConnection.getAccountId())),
    mergeMap(account => account.getAccountBalance()),
    map(balance => balance.available)
  )

  public signOut() {
    this.loading$.next(true);
    this.walletConnection.pipe(
      map(wallet => wallet.signOut())
    ).subscribe(() => {
      this.loading$.next(false);
      this.update$.next(true);
      window.location.replace(window.location.origin + window.location.pathname);
    })
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { utils } from 'near-api-js';

@Pipe({name: 'toNear'})
export class ToNear implements PipeTransform {
  transform(value: number|string|null): string {
    if (value) {
      let amountStr = value.toLocaleString('fullwide', {useGrouping:false})
      return utils.format.formatNearAmount(amountStr)
    }
    return ''
  }
}