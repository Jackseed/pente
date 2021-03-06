import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  public games$: Observable<Game[]>;

  constructor(
    public gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.games$ = this.gameService.getGames();
  }

  joinGame(game) {
    this.gameService.joinGame(game);
  }



}
