import { Injectable } from '@angular/core';
import * as nearAPI from "near-api-js";
import { WalletAccount } from 'near-api-js';
import { BehaviorSubject, from, interval, map, mergeMap, Observable, shareReplay, tap, zip } from 'rxjs';
import { environment } from '../environments/environment';
const nearConfig = {
  headers: {},
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
};

@Injectable({
  providedIn: 'root'
})
export class NearService {
  constructor() {
    this.isSignedIn.subscribe(console.log)
  }
  private connect = from(nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  }));

  public wallet = this.connect.pipe(
    map((connection) => new nearAPI.WalletConnection(connection, "app")),
    tap((connection) => {
      this.isSignedIn.next(connection.isSignedIn()),
      this.accounId.next(connection.getAccountId())
    })
  );

  public signIn = this.wallet.pipe(
    mergeMap(wallet => wallet.requestSignIn(environment.contract)),
    tap(() => {
      this.isSignedIn.next(true)
    })
  )

  public signOut = this.wallet.pipe(
    map(wallet => wallet.signOut()),
    tap(() => {
      this.isSignedIn.next(false)
    })
  )

  public isSignedIn = new BehaviorSubject(false);
  public accounId = new BehaviorSubject(null);

}
