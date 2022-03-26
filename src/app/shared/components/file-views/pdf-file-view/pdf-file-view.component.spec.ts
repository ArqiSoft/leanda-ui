import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdfFileViewComponent } from './pdf-file-view.component';

describe('PdfFileViewComponent', () => {
  let component: PdfFileViewComponent;
  let fixture: ComponentFixture<PdfFileViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PdfFileViewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
