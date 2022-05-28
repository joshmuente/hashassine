import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { utils } from 'near-api-js';
import { AddRewardPopupComponent } from '../add-reward-popup/add-reward-popup.component';
import { HashassineContractService } from '../hashassine-contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public hashassine: HashassineContractService,
    private dialog: MatDialog,
    private overlay: Overlay
  ) { }

  public length = 500;
  public pageSize = 10;
  public pageIndex = 0;
  public challenges: any;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateList(this.pageIndex);
  }

  updateList(index: number) {
    const num = index * this.pageSize;
    this.challenges = this.hashassine.getMyChallenges()
  }

  convertToNear(amount: number) {
    let amountStr = amount.toLocaleString('fullwide', {useGrouping:false})
    return utils.format.formatNearAmount(amountStr)
  }

  openRewardPopup(id: number, amount: number) {
    const dialogRef = this.dialog.open(AddRewardPopupComponent, {
      data: {
        id: id,
        amount: amount
      },
      width: '40%'
    });
  }

  ngOnInit(): void {
    this.challenges = this.hashassine.getMyChallenges()
  }

}
