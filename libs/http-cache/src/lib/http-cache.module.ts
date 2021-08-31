import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CacheInterceptor } from './interceptors';

export const HTTP_CACHE_CLIENT_CONFIG_OPTIONS = new InjectionToken<
  Required<HttpCacheModuleConfig>
>('http cache client module config');

export interface HttpCacheModuleConfig {
  /**
   * Time in ms
   */
  expirationTime: number;
  /**
   * Interval in seconds to clean expired cache requests
   */
  cleanChacheIntervalInSeconds?: number;
}

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
  ],
})
export class HttpCacheModule {
  constructor(@Optional() @SkipSelf() parentModule?: HttpCacheModule) {
    if (parentModule) {
      throw new Error('Module is already loaded.');
    }
  }

  static forRoot(
    config: HttpCacheModuleConfig
  ): ModuleWithProviders<HttpCacheModule> {
    const value: Required<HttpCacheModuleConfig> = {
      cleanChacheIntervalInSeconds: 5,
      ...config,
    };
    return {
      ngModule: HttpCacheModule,
      providers: [
        {
          provide: HTTP_CACHE_CLIENT_CONFIG_OPTIONS,
          useValue: value,
        },
      ],
    };
  }
}
