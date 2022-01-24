import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-solution-popup',
  templateUrl: './solution-popup.component.html',
  styleUrls: ['./solution-popup.component.scss']
})
export class SolutionPopupComponent implements OnInit {
  message: string = ""
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<SolutionPopupComponent>) {
    if (data) {
      this.message = data.message || this.message;
    }
  }

  ngOnInit(): void {
  }

}
