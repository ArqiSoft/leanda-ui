import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericMetadataPreviewComponent } from './generic-metadata-preview.component';

describe('GenericMetadataPreviewComponent', () => {
  let component: GenericMetadataPreviewComponent;
  let fixture: ComponentFixture<GenericMetadataPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericMetadataPreviewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMetadataPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
