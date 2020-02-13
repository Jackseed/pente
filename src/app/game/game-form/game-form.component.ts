import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { createGame } from '../game.model';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {
  submitted = false;
  game = createGame();
  constructor(
    public gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() { this.submitted = true; }

  public async createNewGame() {
    const gameName = this.game.name;
    const gameId = await this.gameService.createNewGame(gameName);
    console.log(gameId);
    console.log(gameName);
    this.router.navigate([`/games/${gameId}`]);
  }

}
