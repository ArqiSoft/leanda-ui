import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetStepperComponent } from './dataset-stepper.component';

describe('DatasetStepperComponent', () => {
  let component: DatasetStepperComponent;
  let fixture: ComponentFixture<DatasetStepperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [DatasetStepperComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
