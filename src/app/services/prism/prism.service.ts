// src/app/services/prism/prism-rehighlight.service.ts
import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, switchMap, take } from 'rxjs/operators';
import Prism from 'src/app/prism-setup';

@Injectable({ providedIn: 'root' })
export class PrismRehighlightService {
  constructor(router: Router, private zone: NgZone, appRef: ApplicationRef) {
    // router.events.pipe(
    //   filter(e => e instanceof NavigationEnd),
    //   // wait until Angular reports the app is stable after this nav
    //   switchMap(() => appRef.isStable.pipe(filter(Boolean), take(1)))
    // ).subscribe(() => {
    //   this.zone.runOutsideAngular(() => {
    //     // one extra paint + macrotask for images/fonts/layout
    //     requestAnimationFrame(() => setTimeout(() => (Prism as any).highlightAll?.(), 0));
    //   });
    // });
  }
}
