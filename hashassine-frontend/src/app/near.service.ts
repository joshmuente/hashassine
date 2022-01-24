import { Injectable } from '@angular/core';
import * as nearAPI from "near-api-js";
import { from, map, mergeMap, Observable, shareReplay, tap } from 'rxjs';

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
  private connection = from(nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  }))

  public connect(): Observable<nearAPI.WalletConnection> {
    return this.connection.pipe(
      map((connection) => new nearAPI.WalletConnection(connection, "app")),
      tap(() => {console.log("near connect")}),
      shareReplay()
    )
  }

}
