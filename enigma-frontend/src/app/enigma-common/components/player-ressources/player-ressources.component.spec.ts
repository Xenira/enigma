import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRessourcesComponent } from './player-ressources.component';

describe('PlayerRessourcesComponent', () => {
  let component: PlayerRessourcesComponent;
  let fixture: ComponentFixture<PlayerRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerRessourcesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
