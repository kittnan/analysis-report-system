import { TestBed } from '@angular/core/testing';

import { ProgressForm3Service } from './progress-form3.service';

describe('ProgressForm3Service', () => {
  let service: ProgressForm3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressForm3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
