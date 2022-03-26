import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MachineLearningFactoryComponent } from './machine-learning-factory.component';

describe('MachineLearningFactoryComponent', () => {
  let component: MachineLearningFactoryComponent;
  let fixture: ComponentFixture<MachineLearningFactoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MachineLearningFactoryComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLearningFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
