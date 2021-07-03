import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, first, shareReplay, tap } from 'rxjs/operators';
import { CacheHeaders } from '../cache-client';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<
    string,
    {
      expires: number;
      response$: Observable<HttpEvent<unknown>>;
    }
  >();
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isCacheable = request.headers.has(CacheHeaders.Cache);
    if (!isCacheable) {
      return next.handle(request);
    }
    const expiresIn =
      Number.parseInt(request.headers.get(CacheHeaders.Cache) ?? '') || 5000;

    request = request.clone({
      headers: request.headers.delete(CacheHeaders.Cache),
    });

    const requestHash = this.hashRequest(request);
    const cachedResponse = this.cache.get(requestHash);
    const currentTime = new Date().getTime();

    if (cachedResponse && cachedResponse.expires > currentTime) {
      console.log(requestHash, 'Cached value...')
      return cachedResponse.response$;
    }
    const expirationTime = currentTime + expiresIn;
    const response$ = next.handle(request).pipe(
      filter((res) => res instanceof HttpResponse),
      shareReplay(1)
    );

    this.cache.set(requestHash, {
      expires: expirationTime,
      response$,
    });

    console.log(requestHash, 'Requesting to server...');

    return response$; //.pipe(first());
  }

  private hashRequest(request: HttpRequest<unknown>): string {
    return `#${request.method}: ${request.urlWithParams}@${
      request.serializeBody()?.toString() ?? ''
    }`;
  }
}
