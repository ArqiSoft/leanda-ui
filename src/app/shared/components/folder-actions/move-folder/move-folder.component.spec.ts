import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoveFolderComponent } from './move-folder.component';

describe('MoveFolderComponent', () => {
  let component: MoveFolderComponent;
  let fixture: ComponentFixture<MoveFolderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MoveFolderComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
