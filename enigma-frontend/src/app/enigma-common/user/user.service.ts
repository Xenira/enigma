import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface IUser {
  username: string;
  email: string;
  permissions: UserPermissions;
}

export enum UserPermissions {
  UNCONFIRMED = 'UNCONFIRMED',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  loggedIn?: boolean = undefined;
  user?: IUser;

  register(
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    return this.http
      .post<void>(environment.apiUrl + '/register', {
        username,
        email,
        password,
      })
      .pipe(tap(() => (this.loggedIn = true)));
  }

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<void>(
        environment.apiUrl + '/login',
        {
          username: email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(tap(() => (this.loggedIn = true)));
  }

  getLogin(): Observable<boolean> {
    if (this.loggedIn === undefined) {
      return this.http
        .get<IUser>(environment.apiUrl + '/login', {
          withCredentials: true,
        })
        .pipe(
          tap((l) => {
            this.loggedIn = true;
            this.user = l;
          }),
          map(() => true),
          catchError((err) => of(false))
        );
    }
    return of(this.loggedIn);
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(
        environment.apiUrl + '/logout',
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(finalize(() => (this.loggedIn = false)));
  }
}
