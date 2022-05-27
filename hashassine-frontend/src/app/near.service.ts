import { Injectable } from '@angular/core';
import * as nearAPI from "near-api-js";
import { BehaviorSubject, combineLatest, from, map, mergeMap, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../environments/environment';
const nearConfig = {
  headers: { "Content-Type": "application/json" },
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
    map((connection) => new nearAPI.WalletConnection(connection, environment.contract))
  );

  public accountId: Observable<String> = combineLatest([this.walletConnection, this.update$]).pipe(
    map(([walletConnection, update]) => walletConnection.getAccountId()),
    tap(console.log)
  )

  public isLoggedIn = combineLatest([this.walletConnection, this.update$]).pipe(
    tap(console.log),
    map(([walletConnection, update]) => walletConnection.isSignedIn()),
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
