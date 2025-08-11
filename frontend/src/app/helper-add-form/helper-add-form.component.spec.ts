import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperAddFormComponent } from './helper-add-form.component';

describe('HelperAddFormComponent', () => {
  let component: HelperAddFormComponent;
  let fixture: ComponentFixture<HelperAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperAddFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
