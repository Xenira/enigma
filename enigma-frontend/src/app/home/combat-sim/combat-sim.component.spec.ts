import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatSimComponent } from './combat-sim.component';

describe('CombatSimComponent', () => {
  let component: CombatSimComponent;
  let fixture: ComponentFixture<CombatSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CombatSimComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
