import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { NavComponent } from './nav/nav.component';
import { EnigmaCommonModule } from '../enigma-common/enigma-common.module';
import { HomeComponent } from './home.component';
import { OverviewComponent } from './overview/overview.component';
import { PlanetComponent } from './planet/planet.component';
import { ResearchComponent } from './research/research.component';
import { HangarComponent } from './hangar/hangar.component';
import { CombatSimComponent } from './combat-sim/combat-sim.component';
import { InboxComponent } from './inbox/inbox.component';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    OverviewComponent,
    PlanetComponent,
    ResearchComponent,
    HangarComponent,
    CombatSimComponent,
    InboxComponent,
    EventsComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, EnigmaCommonModule, HomeRoutingModule],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
