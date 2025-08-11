import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperOverviewComponent } from './helper-overview.component';

describe('HelperOverviewComponent', () => {
  let component: HelperOverviewComponent;
  let fixture: ComponentFixture<HelperOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
