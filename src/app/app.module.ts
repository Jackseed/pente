import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import {MatIconModule} from '@angular/material/icon';
import { GameModule } from './game/game.module';

const firebaseConfig = {
  apiKey: 'AIzaSyD8cItYsuOobtu8nsJBQU6_bQWEmQFaiv0',
  authDomain: 'pente-acbb0.firebaseapp.com',
  databaseURL: 'https://pente-acbb0.firebaseio.com',
  projectId: 'pente-acbb0',
  storageBucket: 'pente-acbb0.appspot.com',
  messagingSenderId: '63745554532',
  appId: '1:63745554532:web:15cbcc90af48d16273c771'
};

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    UserProfileComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatIconModule,
    GameModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],

})
export class AppModule { }
