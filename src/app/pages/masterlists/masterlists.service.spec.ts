import { TestBed } from '@angular/core/testing';

import { MasterlistsService } from './masterlists.service';

describe('MasterlistsService', () => {
  let service: MasterlistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterlistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
