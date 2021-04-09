import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from './enigma-common/guards/authorization.guard';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canLoad: [AuthorizationGuard],
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
    canLoad: [AuthorizationGuard],
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
