import { Message } from '@angular-experiments/api-interfaces';
import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EMPTY, interval, of } from 'rxjs';
import { delay, mergeMap, switchMap, take } from 'rxjs/operators';
import { HttpCacheClientService } from '@angular-experiments/http-cache';
import { Cache } from '@angular-experiments/cache-decorator';

@Component({
  selector: 'angular-experiments-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private _count = 0;

  hello$ = this.http.get<Message>('/api/hello', {
    context: new HttpContext().set(
      new HttpContextToken<boolean>(() => true),
      false
    ),
  });
  helloCached$ = this.cacheClient.get<Message>(
    '/api/hello',
    {
      headers: new HttpHeaders({ 'x-api-version': '1.0' }),
      params: {
        name: 'World&a=12',
      },
    },
    {
      expiresIn: 10000,
      refresh: false,
    }
  );
  helloWithDelay$ = of(EMPTY).pipe(
    delay(2000),
    switchMap(() => this.helloCached$)
  );
  helloWithDelay2$ = of(EMPTY).pipe(
    delay(4000),
    switchMap(() => this.helloCached$)
  );

  constructor(
    private http: HttpClient,
    private cacheClient: HttpCacheClientService
  ) {

  }

  ngOnInit(): void {
    interval(500).pipe(
      take(10),
      mergeMap(() => this.getCount())
    ).subscribe(
      console.log
    );
    this.hi();
  }

  @Cache({ duration: 4000 })
  getCount() {
    return of(this._count++);
  }

  @Cache()
  hi() {
    return 'hi';
  }

  sayHello() {
    this.helloCached$.subscribe(console.log, console.error);
    this.helloCached$.toPromise().then(console.log).catch(console.error);
  }
}
