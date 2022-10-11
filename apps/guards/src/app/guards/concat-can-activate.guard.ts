import { Injectable, Injector, ProviderToken } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { concatMap, first, take, tap } from 'rxjs/operators';

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
    const instances$ = guards.map((g) => this.injector.get(g));

    return concatUntilLast<CanActivate, boolean | UrlTree>(
      instances$,
      (g) => mapToObservable(g.canActivate(route, state)),
      (value) => !(value === true),
      true
    );
  }
}

export function concatUntilLast<T, U = T>(
  sources: Array<T>,
  mapObservableFn: (value: T) => Observable<U>,
  cancelFn: (value: U) => boolean = () => true,
  defaultValue: U
) {
  if (sources.length === 0) {
    return mapToObservable(defaultValue);
  }

  return from(sources).pipe(
    concatMap((s) => mapObservableFn(s).pipe(take(1))),
    tap(console.log),
    first((x) => cancelFn(x), defaultValue),
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
