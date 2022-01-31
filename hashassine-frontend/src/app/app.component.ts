import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { HashassineContractService } from './hashassine-contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {

  public challenges = this.hashassine.getAddedChallenges(0, 100);

  constructor(public hashassine: HashassineContractService, @Inject(DOCUMENT) public document: Document) {
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
}
