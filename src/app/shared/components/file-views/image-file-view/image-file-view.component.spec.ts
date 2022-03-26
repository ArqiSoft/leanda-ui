import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageFileViewComponent } from './image-file-view.component';

describe('ImageFileViewComponent', () => {
  let component: ImageFileViewComponent;
  let fixture: ComponentFixture<ImageFileViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageFileViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
