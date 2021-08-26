import {
  HttpContext,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';


export interface RequestOptions {
  headers?: HttpHeaders;
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams |
  {
    [param: string]: string |
    number |
    boolean |
    ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
