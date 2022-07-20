import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MenuItemComponent, MenuComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [CommonModule, RouterModule],
  exports: [MenuItemComponent, MenuComponent],
})
export class CoreModule {}
