import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertiesEditorComponent } from './properties-editor.component';

describe('PropertiesEditorComponent', () => {
  let component: PropertiesEditorComponent;
  let fixture: ComponentFixture<PropertiesEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PropertiesEditorComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
