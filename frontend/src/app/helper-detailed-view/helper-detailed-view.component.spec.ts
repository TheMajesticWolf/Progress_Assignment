import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperDetailedViewComponent } from './helper-detailed-view.component';

describe('HelperDetailedViewComponent', () => {
  let component: HelperDetailedViewComponent;
  let fixture: ComponentFixture<HelperDetailedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperDetailedViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
