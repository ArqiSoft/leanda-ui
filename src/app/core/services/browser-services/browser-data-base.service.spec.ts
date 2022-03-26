import {TestBed, inject} from '@angular/core/testing';

import {BrowserDataBaseService} from './browser-data-base.service';

describe('BrowserDataBaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [BrowserDataBaseService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should be created', inject([BrowserDataBaseService], (service: BrowserDataBaseService) => {
    expect(service).toBeTruthy();
  }));
});
