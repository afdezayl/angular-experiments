import { TestBed } from '@angular/core/testing';

import { HttpCacheClientService } from './http-cache-client.service';

describe('CacheClientService', () => {
  let service: HttpCacheClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCacheClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
