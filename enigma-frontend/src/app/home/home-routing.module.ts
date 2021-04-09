import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CombatSimComponent } from './combat-sim/combat-sim.component';
import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home.component';
import { InboxComponent } from './inbox/inbox.component';
import { OverviewComponent } from './overview/overview.component';
import { PlanetDetailsComponent } from './planet/planet-details/planet-details.component';
import { PlanetComponent } from './planet/planet.component';
import { ProfileComponent } from './profile/profile.component';
import { ResearchComponent } from './research/research.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'combat-sim',
        component: CombatSimComponent,
        loadChildren: () =>
          import('./combat-sim/combat-sim.module').then(
            (m) => m.CombatSimModule
          ),
      },
      {
        path: 'events',
        component: EventsComponent,
      },
      {
        path: 'hangar',
        loadChildren: () =>
          import('./hangar/hangar.module').then((m) => m.HangarModule),
      },
      {
        path: 'inbox',
        component: InboxComponent,
      },
      {
        path: 'planet',
        component: PlanetComponent,
        children: [
          {
            path: ':id',
            component: PlanetDetailsComponent,
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'research',
        component: ResearchComponent,
      },
      {
        path: 'shipyard',
        loadChildren: () =>
          import('./shipyard/shipyard.module').then((m) => m.ShipyardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
