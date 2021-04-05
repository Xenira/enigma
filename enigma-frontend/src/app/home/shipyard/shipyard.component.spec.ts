import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipyardComponent } from './shipyard.component';

describe('ShipyardComponent', () => {
  let component: ShipyardComponent;
  let fixture: ComponentFixture<ShipyardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipyardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipyardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
