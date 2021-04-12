import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, Subject, timer } from 'rxjs';
import { filter, share, shareReplay, switchMap } from 'rxjs/operators';
import { IPlayerView } from '../../../../../../enigma-backend/src/views/player.view';
import { InactivityService } from '../user/inactivity.service';

export interface IRessource {
  current: number;
  production?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private refetch = new Subject<any>();
  private playerData: Observable<IPlayerView> = merge(
    timer(0, 60_000),
    this.refetch
  ).pipe(
    filter(() => !this.inactivityService.isInactive),
    switchMap(() => this.queryPlayerData()),
    shareReplay(1)
  );

  constructor(
    private http: HttpClient,
    private inactivityService: InactivityService
  ) {}

  public getPlayerData(force = false): Observable<IPlayerView> {
    if (force) {
      this.refetch.next();
    }
    return this.playerData;
  }

  private queryPlayerData(): Observable<IPlayerView> {
    return this.http.get<IPlayerView>('api/v1/player').pipe(share());
  }
}
