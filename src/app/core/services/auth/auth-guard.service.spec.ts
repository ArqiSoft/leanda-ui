import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [AuthGuardService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
