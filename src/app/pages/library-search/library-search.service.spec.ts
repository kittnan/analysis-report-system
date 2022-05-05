import { TestBed } from '@angular/core/testing';

import { LibrarySearchService } from './library-search.service';

describe('LibrarySearchService', () => {
  let service: LibrarySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibrarySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
