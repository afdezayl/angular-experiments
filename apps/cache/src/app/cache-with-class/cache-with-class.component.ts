import { cacheUntil } from '@angular-experiments/cache-decorator';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import {
  concatMap,
  delay,
  map,
  mergeMap,
  pairwise,
  scan,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'angular-experiments-cache-with-class',
  templateUrl: './cache-with-class.component.html',
  styleUrls: ['./cache-with-class.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheWithClassComponent {
  //private cacheNumbers = cacheUntil<typeof this.getNumbers>(this.getNumbers);

  page$ = new BehaviorSubject<number>(0);
  size$ = new BehaviorSubject(10);

  private pageChange$ = this.page$.pipe(
    mergeMap((page) => this.size$.pipe(map((size) => ({ page, size })))),
    pairwise(),
    concatMap(([previous, current]) => {
      const previousCapacity = (previous.page + 1) * previous.size;
      const currentCapacity = (current.page + 1) * current.size;

      return currentCapacity > previousCapacity
        ? this.getNumbers(current.page, current.size)
        : of({
            numbers: [],
            page: current.page,
            next: true,
          });
    })
  );

  numbers$: Observable<PaginatedNumbers> = merge(
    this.getNumbers(0, 10),
    this.pageChange$
  ).pipe(
    scan((acc, current) => {
      const currentCapacity = (current.page + 1) * this.size$.value;

      return {
        numbers: [...acc.numbers, ...current.numbers].slice(0, currentCapacity),
        page: current.page,
        next: current.next,
      };
    })
  );
  /* combineLatest([this.page$, this.size$]).pipe(
    //switchMap(([page, size]) => this.cacheNumbers.value$(page, size)),
    switchMap(([page, size]) => {
      const numberForPage$ = of({ page, size }).pipe(
        concatMap(({ page, size }) => this.getNumbers(page, size))
      );

      const allNumbers$ = numberForPage$.pipe(
        scan((acc, current) => ({
          page: current.page,
          numbers: [...acc.numbers, ...current.numbers],
          next: current.next,
        }))
      );
      return allNumbers$;
    }),
    tap(result => console.log(result.numbers))
  ); */

  private getNumbers(page: number, size: number): Observable<PaginatedNumbers> {
    console.log('call');
    const offset = Math.max(0, page) * size;
    const values = [...Array(size).keys()].map((i) => i + 1 + offset);

    return of({ numbers: values, page, next: page <= 10 }).pipe(delay(500));
  }
}

export interface PaginatedNumbers {
  numbers: number[];
  page: number;
  next: boolean;
}
