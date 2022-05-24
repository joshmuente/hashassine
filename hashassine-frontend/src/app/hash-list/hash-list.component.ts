import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HashassineContractService } from '../hashassine-contract.service';
import { SolutionPopupComponent } from '../solution-popup/solution-popup.component';

@Component({
  selector: 'app-hash-list',
  templateUrl: './hash-list.component.html',
  styleUrls: ['./hash-list.component.scss']
})
export class HashListComponent implements OnInit {

  constructor(public hashassine: HashassineContractService, private dialog: MatDialog) { }

  public length = this.hashassine.getChallengeAmount();
  public pageSize = 10;
  public pageIndex = 0;

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateList(this.pageIndex);
  }

  public updateList(index: number) {
    const num = index * this.pageSize;
    this.hashassine.getAddedChallenges(num, num + 10);
  }

  openSolutionPopup(id: number) {
    const dialogRef = this.dialog.open(SolutionPopupComponent, {
      data: {
        id: id
      },
    });
  }

  ngOnInit(): void {
  }

}
