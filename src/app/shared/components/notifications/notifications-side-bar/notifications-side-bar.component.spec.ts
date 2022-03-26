import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationsSideBarComponent } from './notifications-side-bar.component';

describe('NotificationsSideBarComponent', () => {
  let component: NotificationsSideBarComponent;
  let fixture: ComponentFixture<NotificationsSideBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsSideBarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
