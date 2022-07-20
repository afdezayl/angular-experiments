import { ChangeDetectionStrategy, Component } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export type MenuItem = { icon: string; title: string; path: string };

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  private menu: Array<MenuItem> = [
    { icon: 'home-outline', title: 'Dashboard', path: '/dashboard' },
    { icon: 'people-outline', title: 'Customers', path: '/customers' },
    { icon: 'chatbubble-outline', title: 'Message', path: '/messages' },
    { icon: 'help-outline', title: 'Help', path: '/help' },
    { icon: 'settings-outline', title: 'Settings', path: '/settings' },
    { icon: 'lock-closed-outline', title: 'Password', path: '/password' },
    { icon: 'log-out-outline', title: 'Signout', path: '/logout' },
  ];

  menu$: Observable<MenuItem[]> = of(this.menu).pipe(delay(500));
}
