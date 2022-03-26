import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleStructurePredictionComponent } from './single-structure-prediction.component';

describe('SingleStructurePredictionComponent', () => {
  let component: SingleStructurePredictionComponent;
  let fixture: ComponentFixture<SingleStructurePredictionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [SingleStructurePredictionComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleStructurePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
