import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HashassineContractService } from '../hashassine-contract.service';

@Component({
  selector: 'app-solution-popup',
  templateUrl: './solution-popup.component.html',
  styleUrls: ['./solution-popup.component.scss']
})
export class SolutionPopupComponent implements OnInit {
  public id = 0;
  
  dialogForm = this.formBuilder.group({
    solution: ""
  });

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<SolutionPopupComponent>,
  private formBuilder: FormBuilder,
  private hashassine: HashassineContractService) {
    if (data) {
      this.id = data.id || this.id;
    }
  }

  public submit(){
    this.hashassine.submitSolution(this.id, this.dialogForm.value.solution).subscribe()
  }

  ngOnInit(): void {
  }

}
