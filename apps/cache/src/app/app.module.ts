import { HttpCacheModule } from '@angular-experiments/http-cache';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { InterceptorsModule } from './interceptors/interceptors.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    InterceptorsModule,
    HttpCacheModule.forRoot({
      expirationTime: 7000,
      cleanChacheIntervalInSeconds: 30,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
