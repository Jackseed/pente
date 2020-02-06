import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TileComponent } from './tile/tile.component';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'play', component: TileComponent,  canActivate: [AuthGuard] },
  {
    path: 'game',
    component: TileComponent,
    canActivate: [AuthGuard],
    data: { title: 'Pente Game' }
  },
  { path: '',
  redirectTo: '/game',
  pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

