import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from './tile/tile.component';

@NgModule({
  declarations: [TileComponent],
  imports: [CommonModule],
  exports: [TileComponent],
})
export class EnigmaCommonModule {}
