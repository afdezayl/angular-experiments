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
}>(() => ({
  expiresIn: 0,
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
    const { expiresIn } = request.context.get(CACHE_CONTEXT_TOKEN);
    console.log(request.context);

    if (expiresIn <= 0) {
      return next.handle(request);
    }

    const requestHash = this.hashRequest(request);
    const cachedResponse = this.cache.get(requestHash);
    const currentTime = new Date().getTime();

    if (cachedResponse && cachedResponse.expires > currentTime) {
      console.log(requestHash, 'Cached value...');
      return cachedResponse.response$;
    }
    const expirationTime = currentTime + expiresIn;
    const response$ = next.handle(request).pipe(
      filter((res) => res instanceof HttpResponse),
      shareReplay(1)
    );

    if (this.cache.size === 0) {
      console.log('starting interval...');

      this.interval = setInterval(() => {
        this.cleanCache();
      }, this.moduleConfig.cleanChacheIntervalInSeconds * 1000);
    }

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

  private cleanCache() {
    const currentTime = new Date().getTime();
    console.log('cleaning cache...', this.cache);
    for (const [key, value] of this.cache) {
      if (value.expires < currentTime) {
        console.log(`--cleaning: ${key}`);
        this.cache.delete(key);
      }
    }
    console.log(this.cache);
    if (this.cache.size === 0) {
      console.log('clearing interval...');

      clearInterval(this.interval);
    }
  }
}
