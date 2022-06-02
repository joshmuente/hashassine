import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { utils } from 'near-api-js';
import { BehaviorSubject } from 'rxjs';
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
  public max: BehaviorSubject<string> = new BehaviorSubject('0');

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private hashassine: HashassineContractService,
    public nearService: NearService) {
      this.nearService.balance$.subscribe(this.max);
      if (data) {
        this.id = data.id || this.id;
        this.currently_deposited = data.amount || this.currently_deposited;
      }
  }

  public dialogForm = this.formBuilder.group({
    outValue: ["0", Validators.required, ],
    action: ["deposit"]
  });

  public stringToInt(str: string) {
    return parseInt(str);
  }

  get outValue() {
    return this.dialogForm.get('outValue')?.value
  }

  set outValue(value) {
    this.dialogForm.get('outValue')?.setValue(value)
  }

  get action() {
    return this.dialogForm.get('action')?.value
  }

  public submit() {
    const action = this.dialogForm.get('action')?.value;
    const outValue = utils.format.parseNearAmount(this.dialogForm.get('outValue')?.value.toString()) as string;
    if (action == 'deposit') {
      this.hashassine.addChallangeReward(this.id, outValue)
    }
    if (action == 'withdraw') {
      this.hashassine.removeChallengeReward(this.id, outValue)
    }
  }

  toString(n: number) {
    let as_str = n.toLocaleString('fullwide', {useGrouping:false})
    return as_str
  }

  toNear(n: number) {
    let as_str = this.toString(n)
    return utils.format.parseNearAmount(as_str) as string
  }

  onSliderChange(event: MatSliderChange) {
    this.dialogForm.get('outValue')?.setValue(event.value)
  }

  ngOnInit(): void {
    this.max.subscribe(
      (max) => {
        if (parseInt(this.toNear(this.outValue)) > parseInt(max)) {
          this.outValue = utils.format.formatNearAmount(max)
        }
      }
    )
    this.dialogForm.get('action')?.valueChanges.subscribe(value => {
      if (value == 'deposit') {
        this.nearService.balance$.subscribe(this.max);
      }
      if (value == 'withdraw') {
        this.max.next(this.toString(this.currently_deposited));
      }
      
    })
  }

}
