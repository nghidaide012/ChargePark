import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkinglotCreateComponent } from './parkinglot-create.component';

describe('ParkinglotCreateComponent', () => {
  let component: ParkinglotCreateComponent;
  let fixture: ComponentFixture<ParkinglotCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkinglotCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkinglotCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
