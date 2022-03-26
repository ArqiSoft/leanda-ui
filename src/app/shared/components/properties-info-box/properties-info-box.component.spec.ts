import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertiesInfoBoxComponent } from './properties-info-box.component';

describe('PropertiesInfoBoxComponent', () => {
  let component: PropertiesInfoBoxComponent;
  let fixture: ComponentFixture<PropertiesInfoBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PropertiesInfoBoxComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
