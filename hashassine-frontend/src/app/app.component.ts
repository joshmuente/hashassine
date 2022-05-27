import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, merge } from 'rxjs';
import { AddHashPopupComponent } from './add-hash-popup/add-hash-popup.component';
import { HashassineContractService } from './hashassine-contract.service';
import { NearService } from './near.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  public loading$ = this.hashassine.loading$;

  constructor(private dialog: MatDialog, public hashassine: HashassineContractService, @Inject(DOCUMENT) public document: Document, public nearService: NearService) {
    if(localStorage.getItem("theme") == "alternate") {
      this.document.body.classList.toggle("theme-alternate");
    }
  }

  public toggleTheme() {
    if(this.document.body.classList.contains("theme-alternate")) {
      localStorage.setItem('theme', "main");
    } else {
      localStorage.setItem('theme', "alternate");
    }
    this.document.body.classList.toggle("theme-alternate");
  }

  public openAddHashPopup() {
    this.dialog.open(AddHashPopupComponent, {width: '40%'});
  }
}
