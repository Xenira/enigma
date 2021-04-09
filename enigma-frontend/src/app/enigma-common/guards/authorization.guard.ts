import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard
  implements CanActivate, CanActivateChild, CanLoad {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin(route.root.fragment);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin(childRoute.root.fragment);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin(route.path);
  }

  private checkLogin(route?: string): Observable<boolean> {
    return this.userService.getLogin().pipe(
      tap((l) => {
        if (!l) {
          this.redirect(route);
        }
      })
    );
  }

  private redirect(route?: string): void {
    console.log(route);
    const isGameRoute =
      route && (route.startsWith('home') || route.startsWith('map'));
    const path = '/welcome' + (isGameRoute ? '/login' : '');
    this.router.navigateByUrl(path);
  }
}
