import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'angular-experiments-protected',
  template: ` <p>protected works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtectedComponent {}
