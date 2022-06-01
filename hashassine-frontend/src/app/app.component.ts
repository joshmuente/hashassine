import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, merge } from 'rxjs';
import { AddHashPopupComponent } from './add-hash-popup/add-hash-popup.component';
import { HashassineContractService } from './hashassine-contract.service';
import { NearService } from './near.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  public loading$ = this.nearService.loading$;

  constructor(private dialog: MatDialog,
    public hashassine: HashassineContractService,
    @Inject(DOCUMENT) public document: Document,
    public nearService: NearService,
    public domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry) {
      if (localStorage.getItem("theme") == "alternate") {
        this.document.body.classList.toggle("theme-alternate");
      }

      this.matIconRegistry.addSvgIcon(
        "near",
        this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/near.svg")
      );
  }

  public toggleTheme() {
    if (this.document.body.classList.contains("theme-alternate")) {
      localStorage.setItem('theme', "main");
    } else {
      localStorage.setItem('theme', "alternate");
    }
    this.document.body.classList.toggle("theme-alternate");
  }

  public openAddHashPopup() {
    this.dialog.open(AddHashPopupComponent, { width: '40%' });
  }
}
