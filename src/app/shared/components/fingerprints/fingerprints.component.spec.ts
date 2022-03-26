import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FingerprintsComponent } from './fingerprints.component';

describe('FingerprintsComponent', () => {
  let component: FingerprintsComponent;
  let fixture: ComponentFixture<FingerprintsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FingerprintsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
