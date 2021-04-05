import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shipyard',
  },
  {
    path: 'shipyard',
    component: HomeComponent,
    loadChildren: () =>
      import('./shipyard/shipyard.module').then((m) => m.ShipyardModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
