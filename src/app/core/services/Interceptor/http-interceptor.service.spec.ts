import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptorService } from './http-interceptor.service';

describe('HttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [HttpInterceptorService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should be created', inject([HttpInterceptorService], (service: HttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
