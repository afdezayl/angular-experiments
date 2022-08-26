import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';

type CacheFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

const fn1 = (a: string) => a;

const cache: CacheFunction<typeof fn1> = (a: string) => 'aa';

type ObservableFn<T extends (...args: any) => Observable<any>> = (
  ...args: Parameters<T>
) => ReturnType<T>;

export function cacheUntil<T extends (...args: any) => Observable<any>>(
  fn: ObservableFn<T>
) {
  let _observable$: Observable<any> | null = null;
  let lastParams: Parameters<T> | null = null;
  const _refresh$ = new BehaviorSubject<void>(undefined);

  return {
    value$: (...args: Parameters<T>) => {
      if (
        _observable$ !== null &&
        (args === lastParams ||
          JSON.stringify(args) === JSON.stringify(lastParams))
      ) {
        return _observable$;
      }

      _observable$ = _refresh$.pipe(
        switchMap(() => fn(...args)),
        shareReplay(1)
      );

      lastParams = args;

      return _observable$;
    },
    refresh: () => _refresh$.next(),
  };
}

/* export class CacheUntil<T, Fn extends ObservableFn> {
  private _observableFn: Fn;
  private _refresh$ = new BehaviorSubject<void>(undefined);
  private lastParams: Parameters<Fn> | null = null;
  private _observable$: Observable<T> | null = null;

  constructor(observable$: Fn) {
    this._observableFn = observable$;
  }

  getValue$(...args: Parameters<Fn>) {
    if (
      this._observable$ !== null &&
      (args === this.lastParams ||
        JSON.stringify(args) === JSON.stringify(this.lastParams))
    ) {
      return this._observable$;
    }

    this._observable$ = this._refresh$.pipe(
      switchMap(() => this._observableFn(...(args as any[]))),
      shareReplay(1)
    );

    return this._observable$;
  }

  refresh() {
    this._refresh$.next();
  }
} */
