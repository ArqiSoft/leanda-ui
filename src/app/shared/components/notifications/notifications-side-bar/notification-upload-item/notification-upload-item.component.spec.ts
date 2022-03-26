import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationUploadItemComponent } from './notification-upload-item.component';

describe('NotificationUploadItemComponent', () => {
  let component: NotificationUploadItemComponent;
  let fixture: ComponentFixture<NotificationUploadItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [NotificationUploadItemComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUploadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
