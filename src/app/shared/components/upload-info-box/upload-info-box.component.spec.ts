import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadInfoBoxComponent } from './upload-info-box.component';

describe('UploadInfoBoxComponent', () => {
  let component: UploadInfoBoxComponent;
  let fixture: ComponentFixture<UploadInfoBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [UploadInfoBoxComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
