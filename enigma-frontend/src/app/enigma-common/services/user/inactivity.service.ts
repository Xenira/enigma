import { Injectable, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private userActivity!: number;
  isInactive = false;
  userInactive = new Subject<boolean>();

  constructor(private rendererFactory2: RendererFactory2) {
    this.setTimeout();
    this.rendererFactory2
      .createRenderer(null, null)
      .listen(window, 'mousemove', () => this.refreshUserState());
  }

  private setTimeout(): void {
    this.userActivity = (setTimeout(() => {
      this.userInactive.next(true);
      this.isInactive = true;
    }, 15 * 60_000) as unknown) as number;
  }

  private refreshUserState(): void {
    if (this.isInactive) {
      this.userInactive.next(false);
      this.isInactive = false;
    }
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
