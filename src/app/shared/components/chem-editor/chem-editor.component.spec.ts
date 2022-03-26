import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChemEditorComponent } from './chem-editor.component';

describe('ChemEditorComponent', () => {
  let component: ChemEditorComponent;
  let fixture: ComponentFixture<ChemEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
