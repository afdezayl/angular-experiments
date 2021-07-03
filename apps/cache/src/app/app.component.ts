import { Message } from '@angular-experiments/api-interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { CacheClientService } from './core/cache-client/cache-client.service';

@Component({
  selector: 'angular-experiments-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  helloCached$ = this.cacheClient.get<Message>('/api/hello', {
    headers: new HttpHeaders({ 'x-api-version': '1.0' }),
    params: {
      name: 'World&a=12'
    }
  }, {
    expiresIn: 3000
  });
  helloWithDelay$ = of(EMPTY).pipe(
    delay(2000),
    switchMap(() => this.helloCached$)
  );
  helloWithDelay2$ = of(EMPTY).pipe(
    delay(6000),
    switchMap(() => this.helloCached$)
  );

  constructor(
    private http: HttpClient,
    private cacheClient: CacheClientService
  ) {}

  sayHello() {
    this.helloCached$.subscribe(console.log, console.error)
    //this.helloCached$.toPromise().then(console.log).catch(console.error);
  }
}
