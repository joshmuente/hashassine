import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HashassineContractService } from '../hashassine-contract.service';
import { SolutionPopupComponent } from '../solution-popup/solution-popup.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hash-list',
  templateUrl: './hash-list.component.html',
  styleUrls: ['./hash-list.component.scss']
})
export class HashListComponent implements OnInit {

  constructor(public hashassine: HashassineContractService, private dialog: MatDialog, private clipboard: Clipboard, private snackBar: MatSnackBar) { }

  public length = this.hashassine.challangeAmount;
  public pageSize = 10;
  public pageIndex = 0;
  public challenges = this.hashassine.getAddedChallenges(this.pageIndex, this.pageSize);

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateList(this.pageIndex);
  }

  public updateList(index: number) {
    const num = index * this.pageSize;
    this.challenges = this.hashassine.getAddedChallenges(num, num + 10);
  }

  openSolutionPopup(id: number) {
    const dialogRef = this.dialog.open(SolutionPopupComponent, {
      data: {
        id: id
      },
      width: '40%'
    });
  }

  copyToClipboard(data: string, event: any) {
    event.stopPropagation();
    this.clipboard.copy(data);
    this.snackBar.open('Hash copied to clipboard', undefined, {duration: 5000});
  }

  ngOnInit(): void {
  }

}
