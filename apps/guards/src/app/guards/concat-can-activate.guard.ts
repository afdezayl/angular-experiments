import { Injectable, Injector, ProviderToken } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { EMPTY, expand, from, Observable, of, range } from 'rxjs';
import { last, scan, skip, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConcatCanActivateGuard implements CanActivate {
  constructor(private injector: Injector) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const guards: Array<ProviderToken<CanActivate>> =
      route.data['guards'] ?? [];
    const instances$ = guards.map((g) => this.getInstance(g));

    return concatUntilLast<CanActivate, boolean | UrlTree>(
      instances$,
      (g) => mapToObservable(g.canActivate(route, state)),
      (value) => !(value === true)
    );

    return concatUntil(
      guards.map((g) => this.getInstance(g)),
      route,
      state
    );
  }

  private getInstance(guard: ProviderToken<CanActivate>): CanActivate {
    return this.injector.get(guard);
  }
}

export function concatUntil(
  guards: Array<CanActivate>,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> {
  let denied = false;
  return range(0, guards.length - 1).pipe(
    expand((_, index) => {
      if (index >= guards.length || denied) {
        return EMPTY;
      }

      const guard = guards[index];
      console.log(guard);
      return mapToObservable(
        guard.canActivate ? guard.canActivate(route, state) : true
      ).pipe(tap((result) => (denied = !(result === true))));
    }),
    scan((acc, val) => val),
    tap(() => console.log(new Date())),
    last(null, true),
    tap((x) => console.log('---->', x))
  );
}

export function concatUntilLast<T, U = T>(
  sources: Array<T>,
  mapObservableFn: (value: T) => Observable<U>,
  cancelFn: (value: U) => boolean = () => true
) {
  let denied = false;
  if (sources.length === 0) {
    return EMPTY;
  }

  return range(0, sources.length - 1).pipe(
    expand((_, index) => {
      if (denied || index >= sources.length) {
        console.log('END...');
        return EMPTY;
      }

      const source = sources[index];
      return mapObservableFn(source).pipe(tap((x) => (denied = cancelFn(x))));
    }),
    skip(1),
    scan((acc, val) => val),
    tap((x) => console.log(x, new Date())),
    last(null, true),
    tap((x) => console.log('---->', x))
  );
}

export const mapToObservable = <T>(
  value: Observable<T> | Promise<T> | T
): Observable<T> => {
  if (value instanceof Observable) {
    return value;
  }

  if (value instanceof Promise) {
    return from(value);
  }

  return of(value);
};
