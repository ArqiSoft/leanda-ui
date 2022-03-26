import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StringTrimComponent } from './string-trim.component';

describe('StringTrimComponent', () => {
  let component: StringTrimComponent;
  let fixture: ComponentFixture<StringTrimComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [StringTrimComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringTrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
