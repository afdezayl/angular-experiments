import { Message } from '@angular-experiments/api-interfaces';
import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { HttpCacheClientService } from '@angular-experiments/http-cache';

@Component({
  selector: 'angular-experiments-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
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
      expiresIn: 3000,
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
  ) {}

  sayHello() {
    this.helloCached$.subscribe(console.log, console.error);
    //this.helloCached$.toPromise().then(console.log).catch(console.error);
  }
}
