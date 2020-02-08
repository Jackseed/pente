import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Tile, Player, Game } from './game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
  ) { }

  /**
   * Creates a new game for the current user
   */
  async createGame(data: Game) {
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
  addPlayer(gameId: string, player: Player[]) {
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
}
