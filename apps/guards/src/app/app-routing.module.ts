import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcatCanActivateGuard } from './guards/concat-can-activate.guard';
import { Guard1Guard } from './guards/guard-1.guard';
import { Guard2Guard } from './guards/guard-2.guard';
import { ProtectedComponent } from './protected.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    canActivate: [ConcatCanActivateGuard],
    data: {
      guards: [Guard1Guard, Guard2Guard, Guard1Guard, Guard2Guard],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
