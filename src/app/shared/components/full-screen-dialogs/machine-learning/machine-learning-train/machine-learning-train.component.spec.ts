import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MachineLearningTrainComponent } from './machine-learning-train.component';

describe('MachineLearningTrainComponent', () => {
  let component: MachineLearningTrainComponent;
  let fixture: ComponentFixture<MachineLearningTrainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineLearningTrainComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLearningTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
