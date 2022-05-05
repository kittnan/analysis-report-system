import { TestBed } from '@angular/core/testing';

import { SectionManageService } from './section-manage.service';

describe('SectionManageService', () => {
  let service: SectionManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
