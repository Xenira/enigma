import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CombatSimComponent } from './combat-sim.component';

const routes: Routes = [
  {
    path: '',
    component: CombatSimComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CombatSimRoutingModule {}
