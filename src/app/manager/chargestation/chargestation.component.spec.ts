import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargestationComponent } from './chargestation.component';

describe('ChargestationComponent', () => {
  let component: ChargestationComponent;
  let fixture: ComponentFixture<ChargestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
