import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteFolderComponent } from './delete-folder.component';

describe('DeleteFolderComponent', () => {
  let component: DeleteFolderComponent;
  let fixture: ComponentFixture<DeleteFolderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [DeleteFolderComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
