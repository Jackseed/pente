import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Game, Tile, Player } from '../game.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  sub: Subscription;
  tiles: Tile[] = [];
  whitePlayer: Player;
  blackPlayer: Player;
  activePlayer = 'black';
  passivePlayer = 'white';
  neighbour1: number;
  neighbour2: number;
  neighbour3: number;
  neighbour4: number;
  victory = false;

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
    this.whitePlayer = this.game.players[0];
    console.log(this.whitePlayer);
  }

  goBack(): void {
    this.location.back();
  }

  checkCapture(i: number) {
    let x: number;
    let y: number;
    for (x = -1; x <= 1; x++) {
      for (y = -1; y <= 1; y++) {
        if (
          // check if tile[i] is not in the first 3 lines and in the last 3
          ((i + 57 * y < 361) && (i + 57 * y >= 0))
          // check if tile[i] is not in the first 3 columns and in the last 3
          || (((i % 19 > -3 * x) && (i % 19 < 19 + -3 * x) ))
          ) {
            // 3 next spots on a specific direction
            this.neighbour1 = i + (x + 19 * y);
            this.neighbour2 = i + 2 * (x + 19 * y);
            this.neighbour3 = i + 3 * (x + 19 * y);
            if (
              // avoid undifined tiles
              (this.neighbour1 >= 0 && this.neighbour1 < 361)
              && (this.neighbour2 >= 0 && this.neighbour2 < 361)
              && (this.neighbour3 >= 0 && this.neighbour3 < 361)
              && this.game.tiles[i][this.neighbour1].color === this.passivePlayer
              && this.game.tiles[i][this.neighbour2].color === this.passivePlayer
              && this.game.tiles[i][this.neighbour3].color === this.activePlayer
              ) {
                // capture of the tiles
                this.game.tiles[i][this.neighbour1].color = 'grey';
                this.game.tiles[i][this.neighbour2].color = 'grey';
                if (this.activePlayer === 'black') {
                  this.blackPlayer.scoreCapture = this.blackPlayer.scoreCapture + 2;
                } else {
                  this.whitePlayer.scoreCapture = this.whitePlayer.scoreCapture + 2;
                }
            }
        } else {
          return;
        }
      }
    }
  }

  sameColorCheck(i: number, x: number, y: number) {
    let t: number;
    t = i + x + 19 * y;
    if (t >= 0 && t < 360) {
      if (this.game.tiles[i].color === this.game.tiles[t].color) {
        return true;
      } else {
        return false;
      }
    } else {
      return 'out';
    }
  }

  checkVictory(i: number) {
    let x: number;
    let y: number;
    let px: number;
    let py: number;
    let nx: number;
    let ny: number;
    let counter: number;

    if (this.whitePlayer.scoreCapture === 10 || this.blackPlayer.scoreCapture === 10) {
      this.victory = true;
      console.log('Victory for '.concat(this.activePlayer));
      if (this.whitePlayer.color === this.activePlayer) {
        this.whitePlayer.scoreVictory++;
      } else {
        this.blackPlayer.scoreVictory++;
      }
    }

    for (x = -1; x <= 1; x++) {
      for (y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) {
          y = y + 1;
        } else {
          px = x;
          py = y;
          nx = -x;
          ny = -y;

          counter = 0;

          while (this.sameColorCheck(i, px, py) === true) {
            i = i + px + 19 * py;
            counter++;
          }
          while (this.sameColorCheck(i, nx, ny) === true) {
            nx = nx - x;
            ny = ny - y;
            counter++;
          }
          if (counter >= 7) {
            this.victory = true;
            console.log('Victory for '.concat(this.activePlayer));
            if (this.whitePlayer.color === this.activePlayer) {
              this.whitePlayer.scoreVictory++;
            } else {
              this.blackPlayer.scoreVictory++;
            }
          }
        }
      }
    }
  }


  play(i: number) {
    if (this.game.tiles[i].color !== 'grey' || this.victory) {
      return;
    } else {
      this.game.tiles[i].color = this.game.players[0].color;
      this.checkCapture(i);
      this.checkVictory(i);
      if (this.activePlayer === 'black') {
        this.activePlayer = 'white';
        this.passivePlayer = 'black';
      } else {
        this.activePlayer = 'black';
        this.passivePlayer = 'white';
      }
    }
  }
}
