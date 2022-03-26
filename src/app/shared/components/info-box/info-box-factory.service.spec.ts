import { TestBed, inject } from '@angular/core/testing';

import {InfoBoxFactoryService} from './info-box-factory.service';

describe('FieldFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [InfoBoxFactoryService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should be created', inject([InfoBoxFactoryService], (service: InfoBoxFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
