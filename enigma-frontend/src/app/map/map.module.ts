import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { EnigmaCommonModule } from '../enigma-common/enigma-common.module';
import { MapRoutingModule } from './map-routing.module';
import { MapService } from './map.service';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, EnigmaCommonModule, MapRoutingModule],
  providers: [MapService],
})
export class MapModule {}
