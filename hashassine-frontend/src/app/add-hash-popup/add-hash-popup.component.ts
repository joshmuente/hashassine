import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators, AbstractControlOptions } from '@angular/forms';
import { hash, HashassineContractService } from '../hashassine-contract.service';

@Component({
  selector: 'app-add-hash-popup',
  templateUrl: './add-hash-popup.component.html',
  styleUrls: ['./add-hash-popup.component.scss']
})
export class AddHashPopupComponent implements OnInit {

  public hashTypes = ["Md5", "Sha1"];

  public hashValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      let hash = control.get('hash')?.value;
      let hashType: hash = control.get('hashType')?.value;
      let regex = new RegExp('');
      if (hashType == 'Md5') {
        regex = new RegExp('^[a-f0-9]{32}$')
      }
      if (hashType == 'Sha1') {
        regex = new RegExp('^[a-fA-F0-9]{40}$')
      }

      if (!regex.test(hash)) {
        return { 'error': 'error' }
      }
      return null
    }
  }

  public dialogForm = this.formBuilder.group({
    hash: ["", Validators.required],
    hashType: ["", Validators.required]
  }, { validators: [this.hashValidator()], updateOn: 'change' });

  constructor(private formBuilder: FormBuilder,
    private hashassine: HashassineContractService) { }

  public submit() {
    this.hashassine.addChallenge(this.dialogForm.value.hash, this.dialogForm.value.hashType)
  }

  ngOnInit(): void {
  }

}
