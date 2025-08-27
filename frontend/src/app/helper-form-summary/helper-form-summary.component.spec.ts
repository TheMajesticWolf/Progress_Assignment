import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperFormSummaryComponent } from './helper-form-summary.component';

describe('HelperFormSummaryComponent', () => {
  let component: HelperFormSummaryComponent;
  let fixture: ComponentFixture<HelperFormSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperFormSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperFormSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
