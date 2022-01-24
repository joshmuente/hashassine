import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HashassineContractService } from './hashassine-contract.service';
import { NearService } from './near.service';
import { SolutionPopupComponent } from './solution-popup/solution-popup.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public challenges = this.hashassine.getAddedChallenges(0, 100);

  constructor(public hashassine: HashassineContractService, private dialog: MatDialog) {
  }

  title = 'hashassine-frontend';

  openSolutionPopup() {

    const dialogRef = this.dialog.open(SolutionPopupComponent,{
      data:{
        message: 'HelloWorld',
        buttonText: {
          cancel: 'Done'
        }
      },
    });
}
}
