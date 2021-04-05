import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { NavComponent } from './nav/nav.component';
import { EnigmaCommonModule } from '../enigma-common/enigma-common.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, NavComponent],
  imports: [CommonModule, EnigmaCommonModule, HomeRoutingModule],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
