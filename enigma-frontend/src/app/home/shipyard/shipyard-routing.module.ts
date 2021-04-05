import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipyardComponent } from './shipyard.component';

const routes: Routes = [
  {
    path: '',
    component: ShipyardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipyardRoutingModule {}
