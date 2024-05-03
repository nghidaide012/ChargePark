import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargestationCreateComponent } from './chargestation-create.component';

describe('ChargestationCreateComponent', () => {
  let component: ChargestationCreateComponent;
  let fixture: ComponentFixture<ChargestationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargestationCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargestationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
