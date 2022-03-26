import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizeBrowserComponent } from './organize-browser.component';

describe('OrganizeBrowserComponent', () => {
  let component: OrganizeBrowserComponent;
  let fixture: ComponentFixture<OrganizeBrowserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeBrowserComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
