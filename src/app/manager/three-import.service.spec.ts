import { TestBed } from '@angular/core/testing';

import { ThreeImportService } from './three-import.service';

describe('ThreeImportService', () => {
  let service: ThreeImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
