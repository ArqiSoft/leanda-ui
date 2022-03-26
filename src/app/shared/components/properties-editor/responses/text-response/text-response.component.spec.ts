import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TextResponseComponent } from './text-response.component';

describe('TextResponseComponent', () => {
  let component: TextResponseComponent;
  let fixture: ComponentFixture<TextResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextResponseComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
