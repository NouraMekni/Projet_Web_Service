import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpratorDashboardComponent } from './operator-dashboard.component';

describe('OpratorDashboardComponent', () => {
  let component: OpratorDashboardComponent;
  let fixture: ComponentFixture<OpratorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpratorDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpratorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
