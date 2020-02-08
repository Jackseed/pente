import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { Tile, Player, Game, createGame } from './game.model';
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
  async createNewGame(data: Game) {
    const user = await this.afAuth.auth.currentUser;
    const tiles: Tile[] = [];
    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 19; j++) {
        tiles.push({
          x: j,
          y: i,
        });
      }
    }
    return this.db.collection('games').add({
      ...data,
      players: [{
        userId: user.uid,
        isActive: false,
        color: 'white',
        scoreCapture: 0,
        scoreVictory: 0
      }],
      tiles: {tiles},
    });
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
  addPlayer(gameId: string, player: Player) {
    return this.db
      .collection('games')
      .doc(gameId)
      .update({ player });
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
   * Get the game list
   */
  getGames() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.collection<Game>('games', ref =>
          ref.orderBy('name')
          ).valueChanges({idField: 'id'});
        } else {
          return [];
        }
      })
    );
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
    const player = {
      userId: user.uid,
      isActive: false,
      color: 'black',
      scoreCapture: 0,
      scoreVictory: 0
    } as Player;
    this.addPlayer(game.id, player);
    this.router.navigate(['/game/{{game.id}}']);
  }
}
