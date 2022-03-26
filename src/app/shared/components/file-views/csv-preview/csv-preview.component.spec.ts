import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CSVPreviewComponent } from './csv-preview.component';

describe('CSVPreviewComponent', () => {
  let component: CSVPreviewComponent;
  let fixture: ComponentFixture<CSVPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CSVPreviewComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSVPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
