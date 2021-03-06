import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TileComponent } from './tile/tile.component';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game/game.component';
import { GameListComponent } from './game/game-list/game-list.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'play', component: TileComponent },
  { path: 'games', component: GameListComponent, canActivate: [AuthGuard] },
  {
    path: 'game',
    loadChildren: () =>
      import('./game/game.module').then(m => m.GameModule),
      canActivate: [AuthGuard],
  },
  { path: 'games/:id', component: GameComponent },
  { path: '',
  redirectTo: '/play',
  pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

