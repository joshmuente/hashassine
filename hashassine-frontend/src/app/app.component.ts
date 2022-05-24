import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddHashPopupComponent } from './add-hash-popup/add-hash-popup.component';
import { HashassineContractService } from './hashassine-contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {

  public challenges = this.hashassine.getAddedChallenges(0, 100);

  constructor(private dialog: MatDialog,public hashassine: HashassineContractService, @Inject(DOCUMENT) public document: Document) {
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
    this.dialog.open(AddHashPopupComponent);
  }
}
