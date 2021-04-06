import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangarComponent } from './hangar.component';

const routes: Routes = [
  {
    path: '',
    component: HangarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HangarRoutingModule {}
