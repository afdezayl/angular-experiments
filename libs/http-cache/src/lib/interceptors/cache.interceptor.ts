import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';
import {
  HttpCacheModuleConfig,
  HTTP_CACHE_CLIENT_CONFIG_OPTIONS,
} from '../http-cache.module';

export const CACHE_CONTEXT_TOKEN = new HttpContextToken<{
  expiresIn: number;
  refresh: boolean;
}>(() => ({
  expiresIn: 0,
  refresh: false,
}));

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<
    string,
    {
      expires: number;
      response$: Observable<HttpEvent<unknown>>;
    }
  >();

  private interval?: number;

  constructor(
    @Inject(HTTP_CACHE_CLIENT_CONFIG_OPTIONS)
    private readonly moduleConfig: Required<HttpCacheModuleConfig>
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const { expiresIn, refresh } = request.context.get(CACHE_CONTEXT_TOKEN);
    if (expiresIn <= 0) {
      return next.handle(request);
    }

    const requestHash = this.hashRequest(request);
    const cachedResponse = this.cache.get(requestHash);
    const currentTime = new Date().getTime();

    if (!refresh && cachedResponse && cachedResponse.expires > currentTime) {
      return cachedResponse.response$;
    }

    const response$ = next.handle(request).pipe(
      filter((res) => res instanceof HttpResponse),
      shareReplay(1)
    );

    if (this.cache.size === 0) {
      this.interval = setInterval(
        this.cleanCache.bind(this),
        this.moduleConfig.cleanChacheIntervalInSeconds * 1000
      );
    }

    const expirationTime = currentTime + expiresIn;
    this.cache.set(requestHash, {
      expires: expirationTime,
      response$,
    });

    return response$;
  }

  private hashRequest(request: HttpRequest<unknown>): string {
    const body = request.serializeBody()?.toString() ?? '';
    return `#${request.method}:${request.urlWithParams}@${body}`;
  }

  private cleanCache() {
    const currentTime = new Date().getTime();
    for (const [key, value] of this.cache) {
      if (value.expires < currentTime) {
        this.cache.delete(key);
      }
    }

    if (this.cache.size === 0) {
      clearInterval(this.interval);
    }
  }
}
