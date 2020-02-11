import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { Tile, Player, Game, createGame, createTile, createPlayer } from './game.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
  ) { }

  /**
   * Creates a new game for the current user
   */
  async createNewGame() {
    const id = this.db.createId();
    const user = await this.afAuth.auth.currentUser;
    const firstPlayer: Player = createPlayer({
      userId: user.uid,
      color: 'white',
      isActive: true,
    });
    // Create the game
    this.db.collection('games').doc(id).set({id});
    // Create the tiles:
    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 19; j++) {
        const tileId = j + 19 *  i;
        const tileIdToString = tileId.toString();
        this.db.collection('games').doc(id)
          .collection('tiles').doc(tileIdToString).set({
            x: j,
            y: i,
            color: 'grey',
            number: tileId,
        });
      }
    }
    // Create first player:
    this.db.collection('games').doc(id)
      .collection('players').doc(user.uid).set(firstPlayer);

    return id;
  }

  /**
   * Delete a game
   */
  deleteGame(gameId: string) {
    return this.db
      .collection('games')
      .doc(gameId)
      .delete();
  }

  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, userId: string) {
    const secondPlayer: Player = createPlayer({
      userId,
      color: 'black',
    });
    return this.db.collection('games').doc(gameId)
      .collection('players').doc(userId).set(secondPlayer);
  }

  /**
   * Remove a player from the game
   */
  removePlayer(gameId: string, player: Player) {
    return this.db
      .collection('games')
      .doc(gameId)
      .update({
        players: firebase.firestore.FieldValue.arrayRemove(player)
      });
  }

  /**
   * Get Observable players from a game
   */
  getPlayers$(gameId) {
    return this.db.collection('games').doc(gameId)
      .collection('players').valueChanges();
  }

  /**
   * Get players from a game
   */
  public async getPlayers(gameId): Promise<Player[]> {
    const players: Player[] = [];
    await this.db.collection('games').doc(gameId)
      .collection('players')
        .get().toPromise().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const player = createPlayer(doc.data());
            players.push(player);
            console.log(players);
          });
      });
    return players;
  }

  /**
   * Get player from a game with userId
   */
  public async getPlayer(gameId: string, userId: string): Promise<Player> {
    let player: Player = {};
    const playersSnapShot = await this.db.collection('games').doc(gameId)
      .collection('players').doc(userId)
        .get().toPromise().then(doc => {
          player = createPlayer(doc.data());
        });
    return player;
  }

  /**
   * Get passive player from a game
   */
  public async getPassivePlayer(gameId: string): Promise<Player> {
    let player: Player = {};
    const playersSnapShot = await this.db.collection('games').doc(gameId)
      .collection('players', ref => ref.where('isActive', '==', false))
        .get().toPromise().then(querySnapshot => {
          querySnapshot.forEach(doc => {
          player = createPlayer(doc.data());
          console.log(player);
        });
      });
    return player;
  }



  /**
   * Change active player
   */
  public async changeActivePlayer(gameId: string, players: Player[]) {
    console.log('updating players', players, 'active state');
    players.forEach(player => {
      this.db.collection('games').doc(gameId)
        .collection('players').doc(player.userId).update({isActive: !player.isActive});
    });
  }

  /**
   * Get the game list
   */
  getGames() {
    return this.db.collection('games').valueChanges();
  }

  /**
   * Get the tiles from a game
   */
  getGameTiles(gameId) {
    return this.db.collection('games').doc(gameId)
    .collection('tiles', ref => ref.orderBy('number')).valueChanges();
  }

  /**
   * Get the tiles from a game
   */
  public async getActualGameTiles(gameId): Promise<Tile[]> {
    const tiles: Tile[] = [];
    const tilesSnapShot = await this.db.collection('games').doc(gameId)
      .collection('tiles', ref => ref.orderBy('number'))
        .get().toPromise().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const tile = createTile(doc.data());
            tiles.push(tile);
            console.log(tile);
          });
      });
    return tiles;
  }

  /**
   * Get a game by id
   */

  public async getGame(id: string): Promise<Game> {
    const gameSnapShot = await this.db
    .collection('games').doc(id)
      .get().toPromise();
    return createGame(gameSnapShot.data());
  }

  /**
   * Join a player to a game
   */
  async joinGame(game) {
    const user = await this.afAuth.auth.currentUser;
    this.addPlayer(game.id, user.uid);
    this.router.navigate([`/games/${game.id}`]);
  }

  /**
   * Update a tile
   */
  updateTile(gameId: string, i: number, color: 'black' | 'white' | 'grey') {
    const iToString = i.toString();
    console.log('updating tile', i, 'with', color);
    return this.db.collection('games').doc(gameId)
    .collection('tiles').doc(iToString).update({color});
  }

  /**
   * Set a plyer active
   */
  setActive(gameId: string, userId: string) {
    return this.db.collection('games').doc(gameId);
  }
}
