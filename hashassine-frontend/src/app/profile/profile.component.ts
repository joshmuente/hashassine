import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  public length = 500;
  public pageSize = 10;
  public pageIndex = 0;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateList(this.pageIndex);
  }

  updateList(index: number) {
    const num = index * this.pageSize;
    //this.challenges = this.hashassine.getAddedChallenges(num, num + 10);
  }
  ngOnInit(): void {
  }

}
