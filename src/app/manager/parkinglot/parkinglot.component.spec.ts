import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkinglotComponent } from './parkinglot.component';

describe('ParkinglotComponent', () => {
  let component: ParkinglotComponent;
  let fixture: ComponentFixture<ParkinglotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkinglotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkinglotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
