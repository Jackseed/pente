import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Game, Tile, Player } from '../game.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  user$: Observable<User>;
  actualTiles: Tile[];
  tiles$: Observable<Tile[]>;
  player: Player;
  passivePlayer: Player;
  players: Player[];
  players$: Observable<Player[]>;
  neighbour1: number;
  neighbour2: number;
  neighbour3: number;
  neighbour4: number;
  victory = false;
  gameId: string;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private location: Location,
    private afAuth: AuthService,
  ) {}

  ngOnInit() {
    this.user$ = this.afAuth.user$;
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.getGame();
    this.tiles$ = this.gameService.getGameTiles(this.gameId);
    this.players$ = this.gameService.getPlayers$(this.gameId);
    console.log(this.victory);
  }

  private async getGame() {
    this.game = await this.gameService.getGame(this.gameId);
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
              && this.actualTiles[this.neighbour1].color === this.passivePlayer.color
              && this.actualTiles[this.neighbour2].color === this.passivePlayer.color
              && this.actualTiles[this.neighbour3].color === this.player.color
              ) {
                // capture of the tiles
                this.gameService.updateTile(this.game.id, this.neighbour1, 'grey');
                this.gameService.updateTile(this.game.id, this.neighbour2, 'grey');
                this.player.scoreCapture += 2;
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
      if (this.actualTiles[i].color === this.actualTiles[t].color) {
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

    if (this.player.scoreCapture === 10) {
      this.victory = true;
      console.log('Victory for '.concat(this.player.color));
      this.player.scoreVictory ++;
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
            console.log('Victory for '.concat(this.player.color));
            this.player.scoreVictory++;
          }
        }
      }
    }
  }



  public async play(i: number, userId: string) {
    // call the board tiles
    this.actualTiles = await this.gameService.getActualGameTiles(this.game.id);
    // call the players
    this.players = await this.gameService.getPlayers(this.gameId);
    // call the player who played
    this.player = await this.gameService.getPlayer(this.game.id, userId);
    console.log(this.player);
    if (this.players.length < 2) {
      console.log('not enough players, wait for a friend');
      return;
    } else {
      if (!this.player.isActive) {
        console.log('not your turn');
      } else {
        if (this.actualTiles[i].color !== 'grey') {
          console.log('not an authorized play');
          return;
        } else {
          // call the passive player
          this.passivePlayer = await this.gameService.getPassivePlayer(this.game.id);
          console.log('passive player is', this.passivePlayer);
          this.gameService.updateTile(this.game.id, i, this.player.color);
          this.checkCapture(i);
          this.checkVictory(i);
          this.gameService.changeActivePlayer(this.gameId, this.players);
        }
      }
    }
  }
}
