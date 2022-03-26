import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationCommonItemComponent } from './notification-common-item.component';

describe('NotificationCommonItemComponent', () => {
  let component: NotificationCommonItemComponent;
  let fixture: ComponentFixture<NotificationCommonItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationCommonItemComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCommonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
