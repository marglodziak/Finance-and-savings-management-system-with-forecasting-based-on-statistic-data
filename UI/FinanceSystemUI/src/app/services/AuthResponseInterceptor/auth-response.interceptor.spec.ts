import { TestBed } from '@angular/core/testing';

import { AuthResponseInterceptor } from './auth-response.interceptor';

describe('AuthResponseInterceptorService', () => {
  let service: AuthResponseInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthResponseInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
