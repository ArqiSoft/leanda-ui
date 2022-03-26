import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OrganizeInfoBoxFactoryComponent} from './organize-info-box-factory.component';

describe('FieldsFactoryComponent', () => {
  let component: OrganizeInfoBoxFactoryComponent;
  let fixture: ComponentFixture<OrganizeInfoBoxFactoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [OrganizeInfoBoxFactoryComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeInfoBoxFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
