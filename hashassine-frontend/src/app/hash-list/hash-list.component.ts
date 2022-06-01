import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ChallengeFilterBy, HashassineContractService } from '../hashassine-contract.service';
import { SolutionPopupComponent } from '../solution-popup/solution-popup.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { utils } from 'near-api-js';
import { NearService } from '../near.service';

@Component({
  selector: 'app-hash-list',
  templateUrl: './hash-list.component.html',
  styleUrls: ['./hash-list.component.scss']
})
export class HashListComponent implements OnInit {
  
  constructor(
    public near: NearService,
    public hashassine: HashassineContractService,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar)
    { }

  public length = this.hashassine.challangeAmount;
  public pageSize = 10;
  public pageIndex = 0;
  public filter?: ChallengeFilterBy;
  public challenges = this.hashassine.getAddedChallenges(this.pageIndex, this.pageSize, this.filter);

  onFilterChange(event: any) {
    this.updateList(this.pageIndex)
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateList(this.pageIndex);
  }

  public updateList(index: number) {
    const num = index * this.pageSize;
    this.challenges = this.hashassine.getAddedChallenges(num, num + 10, this.filter);
  }

  openSolutionPopup(id: string) {
    const dialogRef = this.dialog.open(SolutionPopupComponent, {
      data: {
        id: parseInt(id)
      },
      width: '40%'
    });
  }

  convertToNear(amount: number) {
    let amountStr = amount.toLocaleString('fullwide', { useGrouping: false });
    return utils.format.formatNearAmount(amountStr);
  }

  copyToClipboard(data: string, event: any) {
    event.stopPropagation();
    this.clipboard.copy(data);
    this.snackBar.open('Hash copied to clipboard', undefined, { duration: 5000 });
  }

  ngOnInit(): void {
  }
}
