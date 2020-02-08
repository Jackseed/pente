import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { CreateButtonComponent } from './create-button/create-button.component';
import {MatIconModule} from '@angular/material/icon';
import { GameComponent } from './game/game.component';
import { GameListComponent } from './game-list/game-list.component';

@NgModule({
  declarations: [CreateButtonComponent, GameComponent, GameListComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatIconModule
  ]
})
export class GameModule { }
