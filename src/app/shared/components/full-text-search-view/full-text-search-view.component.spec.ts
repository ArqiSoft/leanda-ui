import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FullTextSearchViewComponent } from './full-text-search-view.component';

describe('FullTextSearchViewComponent', () => {
  let component: FullTextSearchViewComponent;
  let fixture: ComponentFixture<FullTextSearchViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [FullTextSearchViewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullTextSearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
