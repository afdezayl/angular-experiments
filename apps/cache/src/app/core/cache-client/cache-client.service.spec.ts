import { TestBed } from '@angular/core/testing';

import { CacheClientService } from './cache-client.service';

describe('CacheClientService', () => {
  let service: CacheClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
