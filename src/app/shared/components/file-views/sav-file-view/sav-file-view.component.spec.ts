import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavFileViewComponent } from './sav-file-view.component';

describe('SavFileViewComponent', () => {
  let component: SavFileViewComponent;
  let fixture: ComponentFixture<SavFileViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [SavFileViewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
