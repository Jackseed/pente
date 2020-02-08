import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Game } from '../game.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.getGame();
  }

  private async getGame() {
    const id = this.route.snapshot.paramMap.get('id');
    this.game = await this.gameService.getGame(id);
    console.log(this.game.id);
  }

  goBack(): void {
    this.location.back();
  }
}
