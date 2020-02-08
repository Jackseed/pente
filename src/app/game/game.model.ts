export interface Tile {
  color?: 'black' | 'white'| 'grey' ;
  x?: number;
  y?: number;
}

export interface Player {
  userId?: string;
  isActive?: boolean;
  color?: 'black' | 'white';
  scoreCapture?: number;
  scoreVictory?: number;
}

export interface Game {
  id?: string;
  name?: string;
  tiles?: Tile[];
  players?: Player[];
}
