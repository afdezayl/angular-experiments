import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { BehaviorSubject, delay, lastValueFrom, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Guard2Guard implements CanActivate {
  private x = new BehaviorSubject<boolean>(true);
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      console.log('G-2');
    return this.x.pipe(delay(1000));
  }
}
