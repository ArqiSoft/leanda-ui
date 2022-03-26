import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SplashNotificationsComponent } from './splash-notifications.component';

describe('SplashNotificationsComponent', () => {
  let component: SplashNotificationsComponent;
  let fixture: ComponentFixture<SplashNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashNotificationsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
