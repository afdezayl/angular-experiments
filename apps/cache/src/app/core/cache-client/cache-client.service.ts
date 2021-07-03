import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheConfiguration } from './cache-configuration';
import { CacheHeaders } from './cache-headers.enum';
import { RequestOptions } from './request-options.interface';

@Injectable({
  providedIn: 'root',
})
export class CacheClientService {
  constructor(private readonly http: HttpClient) {}

  public get<T>(
    url: string,
    options: RequestOptions = {},
    config: CacheConfiguration = {}
  ): Observable<T> {
    this._appendCacheHeader(options, config);
    return this.http.get<T>(url, options);
  }

  private _appendCacheHeader(
    options: RequestOptions,
    config: CacheConfiguration
  ) {
    const headers = options.headers ?? new HttpHeaders();
    options.headers = headers.append(
      CacheHeaders.Cache,
      config.expiresIn?.toString() ?? ''
    );
  }
}
