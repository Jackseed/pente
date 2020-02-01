import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';

export interface Tile {
  color: string;
}

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  tile: Tile[] = [];
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

  check(i: number) {
    let x: number;
    let y: number;
    for (x = -1; x <= 1; x++) {
      for (y = -1; y <= 1; y++) {
        if (((i + 58 * y < 361) && (i + 58 * y > 0)) || (((i % 19 > -3 * x) && (i % 19 < 19 + -3 * x) ))) {

          this.neighbour1 = i + (x + 19 * y) ;
          this.neighbour2 = i + 2 * (x + 19 * y);
          this.neighbour3 = i + 3 * (x + 19 * y);
          console.log(this.neighbour3);
          console.log(this.neighbour3);
          if (
            this.tile[this.neighbour1].color === this.passivePlayer
            && this.tile[this.neighbour2].color === this.passivePlayer
            && this.tile[this.neighbour3].color === this.activePlayer
            ) {
              console.log(this.neighbour3);
              this.tile[this.neighbour1].color = 'grey';
              this.tile[this.neighbour2].color = 'grey';


            }
          } else {
            return;
          }
        }
    }
  }



  play(i: number) {
    if (this.tile[i].color !== 'grey') {
      return;
    } else {
      this.tile[i].color = this.activePlayer;
      this.check(i);
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
