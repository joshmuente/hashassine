import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HashassineContractService } from '../hashassine-contract.service';

@Component({
  selector: 'app-add-hash-popup',
  templateUrl: './add-hash-popup.component.html',
  styleUrls: ['./add-hash-popup.component.scss']
})
export class AddHashPopupComponent implements OnInit {

  dialogForm = this.formBuilder.group({
    hash: "",
    type: ["Md5", "Sha1"]
  });

  constructor(private formBuilder: FormBuilder,
    private hashassine: HashassineContractService) { }

  public submit(){
    this.hashassine.addChallenge(this.dialogForm.value.hash, this.dialogForm.value.hashType).subscribe()
  }

  ngOnInit(): void {
  }

}
