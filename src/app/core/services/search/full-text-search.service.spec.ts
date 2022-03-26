import { TestBed, inject } from '@angular/core/testing';

import { FullTextSearchService } from './full-text-search.service';

describe('FullTextSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [FullTextSearchService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should be created', inject([FullTextSearchService], (service: FullTextSearchService) => {
    expect(service).toBeTruthy();
  }));
});
