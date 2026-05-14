import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRiskDriversComponent } from './dashboard-risk-drivers.component';

describe('DashboardRiskDriversComponent', () => {
  let component: DashboardRiskDriversComponent;
  let fixture: ComponentFixture<DashboardRiskDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRiskDriversComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRiskDriversComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
