import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[];
  sub: Subscription;
  constructor(
    public gameService: GameService,
  ) { }

  ngOnInit() {
    this.sub = this.gameService
    .getGames()
    .subscribe(games => (this.games = games));
    console.log(this.games[0].id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createNewGame() {
    this.gameService.createNewGame();
  }

  joinGame(game) {
    this.gameService.joinGame(game);
  }



}
