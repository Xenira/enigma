import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from './tile/tile.component';
import { PlayerRessourcesComponent } from './components/player-ressources/player-ressources.component';

@NgModule({
  declarations: [TileComponent, PlayerRessourcesComponent],
  imports: [CommonModule],
  exports: [TileComponent, PlayerRessourcesComponent],
})
export class EnigmaCommonModule {}
