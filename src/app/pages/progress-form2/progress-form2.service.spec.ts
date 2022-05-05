import { TestBed } from '@angular/core/testing';

import { ProgressForm2Service } from './progress-form2.service';

describe('ProgressForm2Service', () => {
  let service: ProgressForm2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressForm2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
