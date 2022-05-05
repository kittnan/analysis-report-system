import { TestBed } from '@angular/core/testing';

import { ManageFormService } from './manage-form.service';

describe('ManageFormService', () => {
  let service: ManageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
