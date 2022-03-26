import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { AuthProfileGuard } from './auth-profile-guard.guard';

describe('AuthProfileGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [AuthProfileGuard],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([AuthProfileGuard], (guard: AuthProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
