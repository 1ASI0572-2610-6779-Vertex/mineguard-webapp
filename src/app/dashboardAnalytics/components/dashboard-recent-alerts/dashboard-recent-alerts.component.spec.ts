import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecentAlertsComponent } from './dashboard-recent-alerts.component';

describe('DashboardRecentAlertsComponent', () => {
  let component: DashboardRecentAlertsComponent;
  let fixture: ComponentFixture<DashboardRecentAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecentAlertsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRecentAlertsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
