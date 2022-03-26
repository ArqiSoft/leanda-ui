import { TestBed, inject } from '@angular/core/testing';

import { MachineLearningService } from './machine-learning.service';

describe('MachineLearningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [MachineLearningService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should be created', inject([MachineLearningService], (service: MachineLearningService) => {
    expect(service).toBeTruthy();
  }));
});
