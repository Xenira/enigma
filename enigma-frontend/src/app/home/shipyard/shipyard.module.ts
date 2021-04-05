import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipyardComponent } from './shipyard.component';
import { ShipyardRoutingModule } from './shipyard-routing.module';
import { GameModule } from 'src/app/game/game.module';

@NgModule({
  declarations: [ShipyardComponent],
  imports: [CommonModule, ShipyardRoutingModule, GameModule],
})
export class ShipyardModule {}
