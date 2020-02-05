import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';

export interface Tile {
  color: string;
}
export interface Player {
  color: string;
  scoreCapture: number;
  scoreVictory: number;
}

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  tile: Tile[] = [];
  whitePlayer: Player = {
    color: 'white',
    scoreCapture: 0,
    scoreVictory: 0,
  };
    blackPlayer: Player = {
    color: 'black',
    scoreCapture: 0,
    scoreVictory: 0,
  };
  activePlayer = 'black';
  passivePlayer = 'white';
  neighbour1: number;
  neighbour2: number;
  neighbour3: number;
  neighbour4: number;
  victory = false;

  ngOnInit() {
    for (let i = 0; i < 361; i++) {
      this.tile[i] = {color: 'grey'};
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
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
              && this.tile[this.neighbour1].color === this.passivePlayer
              && this.tile[this.neighbour2].color === this.passivePlayer
              && this.tile[this.neighbour3].color === this.activePlayer
              ) {
                // capture of the tiles
                this.tile[this.neighbour1].color = 'grey';
                this.tile[this.neighbour2].color = 'grey';
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
      if (this.tile[i].color === this.tile[t].color) {
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
    if (this.tile[i].color !== 'grey' || this.victory) {
      return;
    } else {
      this.tile[i].color = this.activePlayer;
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
