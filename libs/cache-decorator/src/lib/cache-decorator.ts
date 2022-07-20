import { Observable, shareReplay } from 'rxjs';

export interface CacheOptions {
  /**Miliseconds */
  duration?: number;
}

interface CacheValue {
  value: Observable<unknown>;
  cacheUntil: Date | null;
}

export function Cache(options: CacheOptions = {}) {
  const mappedOptions = Object.assign({ duration: 0 }, options);

  let cacheValue: CacheValue | null = null;
  let originalFn: () => Observable<unknown>;

  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    originalFn = descriptor.value;
    descriptor.value = function (args: []) {
      const now = new Date();
      if (
        cacheValue &&
        (cacheValue.cacheUntil === null || cacheValue?.cacheUntil > now)
      ) {
        return cacheValue.value;
      }

      const result = originalFn.apply(this, args);

      if (!(result instanceof Observable)) {
        throw new Error('Not an observable');
      }

      const obs$ = result.pipe(shareReplay(1));

      cacheValue = {
        value: obs$,
        cacheUntil:
          mappedOptions.duration > 0
            ? new Date(now.getTime() + mappedOptions.duration)
            : null,
      };

      return obs$;
    };
  };
}
