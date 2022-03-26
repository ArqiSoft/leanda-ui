import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwitchResponseComponent } from './switch-response.component';

describe('SwitchResponseComponent', () => {
  let component: SwitchResponseComponent;
  let fixture: ComponentFixture<SwitchResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchResponseComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
