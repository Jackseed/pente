import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';

export interface Tile {
  color: string;
}
export interface Player {
  color: string;
  score: number;
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
    score: 0,
  };
    blackPlayer: Player = {
    color: 'black',
    score: 0,
  };
  activePlayer = 'black';
  passivePlayer = 'white';
  neighbour1: number;
  neighbour2: number;
  neighbour3: number;
  neighbour4: number;
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
                  this.blackPlayer.score = this.blackPlayer.score + 2;
                } else {
                  this.whitePlayer.score = this.whitePlayer.score + 2;
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

    if (this.whitePlayer.score === 10 || this.blackPlayer.score === 10) {
      console.log('Victory for '.concat(this.activePlayer));
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
            console.LOG('salut');
            

          }



          if (counter >= 7) {
            console.log('Victory for '.concat(this.activePlayer));
          }
        }



      }
    }
  }


  play(i: number) {
    if (this.tile[i].color !== 'grey') {
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
