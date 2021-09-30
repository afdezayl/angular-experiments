import { HttpClient, HttpContext } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpCacheModuleConfig,
  HTTP_CACHE_CLIENT_CONFIG_OPTIONS,
} from '../http-cache.module';
import { CACHE_CONTEXT_TOKEN } from '../interceptors/cache.interceptor';
import { CacheConfiguration } from '../models/cache-configuration';
import { RequestOptions } from './request-options.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpCacheClientService {
  constructor(
    private readonly http: HttpClient,
    @Inject(HTTP_CACHE_CLIENT_CONFIG_OPTIONS)
    private readonly moduleConfig: HttpCacheModuleConfig
  ) {}

  public get<T>(
    url: string,
    options: RequestOptions = {},
    config: CacheConfiguration = {}
  ): Observable<T> {
    const newContext = options.context ?? new HttpContext();
    return this.http.get<T>(url, {
      ...options,
      context: newContext.set(CACHE_CONTEXT_TOKEN, {
        expiresIn: config.expiresIn ?? this.moduleConfig.expirationTime,
        refresh: config.refresh ?? false,
      }),
    });
  }
}
