import { async, TestBed } from '@angular/core/testing';
import { HttpCacheModule } from './http-cache.module';

describe('HttpCacheModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpCacheModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(HttpCacheModule).toBeDefined();
  });
});
