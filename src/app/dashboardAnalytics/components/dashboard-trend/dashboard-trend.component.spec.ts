import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrendComponent } from './dashboard-trend.component';

describe('DashboardTrendComponent', () => {
  let component: DashboardTrendComponent;
  let fixture: ComponentFixture<DashboardTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTrendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTrendComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
