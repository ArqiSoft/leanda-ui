import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntityCountsComponent } from './entity-counts.component';

describe('EntityCountsComponent', () => {
  let component: EntityCountsComponent;
  let fixture: ComponentFixture<EntityCountsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityCountsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
