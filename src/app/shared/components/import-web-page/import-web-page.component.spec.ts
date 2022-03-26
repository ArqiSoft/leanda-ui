import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportWebPageComponent } from './import-web-page.component';

describe('ImportWebPageComponent', () => {
  let component: ImportWebPageComponent;
  let fixture: ComponentFixture<ImportWebPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ImportWebPageComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWebPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
