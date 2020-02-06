import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TileComponent } from './tile/tile.component';


const routes: Routes = [
  {
    path: 'game',
    component: TileComponent,
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
