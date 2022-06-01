import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { utils } from 'near-api-js';
import { map } from 'rxjs';
import { HashassineContractService } from '../hashassine-contract.service';
import { NearService } from '../near.service';

@Component({
  selector: 'app-add-reward-popup',
  templateUrl: './add-reward-popup.component.html',
  styleUrls: ['./add-reward-popup.component.scss']
})
export class AddRewardPopupComponent implements OnInit {
  public id = 0;
  public currently_deposited = 0;
  public outValue = 0;
  public action = 'deposit';

  public max = this.nearService.balance$;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, 
    private formBuilder: FormBuilder, 
    private hashassine: HashassineContractService, 
    public nearService: NearService) {
      if (data) {
        this.id = data.id || this.id;
        this.currently_deposited = data.amount;
      }
  }

  onInputChange(event: MatSliderChange) {
    this.outValue = (event.value as number);
  }

  public dialogForm = this.formBuilder.group({
    outValue: ["", Validators.required]
  });

  public stringToInt(str: string) {
    return parseInt(str);
  }

  public submit() {
    if (this.action == 'deposit') {
      this.hashassine.addChallangeReward(this.id, utils.format.parseNearAmount(this.outValue.toString()) as string)
    }
    if (this.action == 'withdraw') {
      this.hashassine.removeChallangeReward(this.id, utils.format.parseNearAmount(this.outValue.toString()) as string)
    }
  }

  ngOnInit(): void {
  }

}
