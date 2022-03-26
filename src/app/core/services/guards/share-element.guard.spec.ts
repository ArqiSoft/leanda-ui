import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { ShareElementGuard } from './share-element.guard';

describe('ShareElementGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareElementGuard],
    });
  });

  it('should ...', inject([ShareElementGuard], (guard: ShareElementGuard) => {
    expect(guard).toBeTruthy();
  }));
});
