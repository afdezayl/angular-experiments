import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheWithClassComponent } from './cache-with-class.component';

describe('CacheWithClassComponent', () => {
  let component: CacheWithClassComponent;
  let fixture: ComponentFixture<CacheWithClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CacheWithClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheWithClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
