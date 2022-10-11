import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { delay, lastValueFrom, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Guard2Guard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      console.log('G-2');
    return of(false).pipe(delay(1000));
  }
}
