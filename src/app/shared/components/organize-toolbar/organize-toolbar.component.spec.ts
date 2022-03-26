import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizeToolbarComponent } from './organize-toolbar.component';

describe('OrganizeToolbarComponent', () => {
  let component: OrganizeToolbarComponent;
  let fixture: ComponentFixture<OrganizeToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [OrganizeToolbarComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
