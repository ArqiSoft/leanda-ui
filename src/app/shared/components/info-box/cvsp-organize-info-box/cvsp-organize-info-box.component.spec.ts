import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CvspOrganizeInfoBoxComponent } from './cvsp-organize-info-box.component';

describe('CvspOrganizeInfoBoxComponent', () => {
  let component: CvspOrganizeInfoBoxComponent;
  let fixture: ComponentFixture<CvspOrganizeInfoBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CvspOrganizeInfoBoxComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvspOrganizeInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
