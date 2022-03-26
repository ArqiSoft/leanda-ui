import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {BasicOrganizeInfoBoxComponent} from './basic-organize-info-box.component';

describe('BasicInputComponent', () => {
  let component: BasicOrganizeInfoBoxComponent;
  let fixture: ComponentFixture<BasicOrganizeInfoBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [BasicOrganizeInfoBoxComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicOrganizeInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
