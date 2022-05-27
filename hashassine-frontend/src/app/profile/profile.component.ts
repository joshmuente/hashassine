import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HashassineContractService } from '../hashassine-contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public hashassine: HashassineContractService
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
    console.log(this.challenges)
  }

  ngOnInit(): void {
    this.challenges = this.hashassine.getMyChallenges()
    this.challenges.subscribe(console.log)
  }

}
