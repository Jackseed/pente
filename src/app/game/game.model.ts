export interface Tile {
  color?: 'black' | 'white'| 'grey' ;
  x?: number;
  y?: number;
  number?: number;
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
/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    ...params
  };
}

/** A factory function that creates Game */
export function createTile(params: Partial<Tile> = {}): Tile {
  return {
    color: params.color,
    x: params.x,
    y: params.y,
    number: params.number,
    ...params
  };
}

/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    userId: params.userId,
    isActive: false,
    color: params.color,
    scoreCapture: 0,
    scoreVictory: 0,
    ...params
  };
}
