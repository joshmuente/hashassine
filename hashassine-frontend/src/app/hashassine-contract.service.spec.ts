import { TestBed } from '@angular/core/testing';

import { HashassineContractService } from './hashassine-contract.service';

describe('HashassineContractService', () => {
  let service: HashassineContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashassineContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
