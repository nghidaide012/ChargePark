import { TestBed } from '@angular/core/testing';

import { ThreeEmployeeService } from './three-employee.service';

describe('ThreeEmployeeService', () => {
  let service: ThreeEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
