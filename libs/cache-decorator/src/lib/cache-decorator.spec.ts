import { concat, delay, of, repeat, tap, toArray } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Cache } from './cache-decorator';

class Counter {
  private _count = 0;
  private _count2 = 0;

  @Cache()
  next() {
    return of(++this._count);
  }

  @Cache({ duration: 1500 })
  nextWithDelay() {
    return of(++this._count2).pipe(delay(600));
  }
}

describe('Cache', () => {
  let testScheduler: TestScheduler;
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should exist', () => {
    expect(Cache).toBeDefined();
  });

  /* it('shoud return always 1', (done) => {
    concat(counter.next(), counter.next())
      .pipe(toArray())
      .subscribe((numbers) => {
        expect(numbers.every((n) => n === 1)).toBe(true);
        done();
      });
  });

  it('should return 1', (done) => {
    counter.nextWithDelay().subscribe({
      next: (n) => {
        expect(n).toBe(1);
      },
      complete: () => done(),
    });
  }); */

  it('shoud return 1 two times and then 2', (done) => {
    jest.useFakeTimers('modern');
    /* concat(
      counter.nextWithDelay(),
      counter.nextWithDelay(),
      counter.nextWithDelay()
    )
      .pipe(toArray())
      .subscribe(
        (numbers) => {
          console.log('-------->', numbers);
          expect(numbers).toBe([1, 1, 4]);
        },
        console.error,
        () => done()
      ); */
    testScheduler.run((helpers) => {
      const next$ = counter
        .nextWithDelay()
        .pipe(tap(() => jest.runAllTimers()));

      const obs$ = concat(next$, next$, next$).pipe(toArray());

      const { expectObservable } = helpers;

      const values = [[1, 1, 2]];

      expectObservable(obs$).toBe('1800ms (0|)', values); //.toBe('1800ms (0|)', values);
    });
  });
});
