import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { MatIconModule } from '@angular/material/icon';
import { GameModule } from './game/game.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


const firebaseConfig = {
  apiKey: "AIzaSyAoX1s0E-K7rJcawJCcR4uUdGAmTHuae54",
  authDomain: "pente-game.firebaseapp.com",
  databaseURL: "https://pente-game.firebaseio.com",
  projectId: "pente-game",
  storageBucket: "pente-game.appspot.com",
  messagingSenderId: "878868981433",
  appId: "1:878868981433:web:9cc778aeccad2090d0dd68"
};

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    UserProfileComponent,
    LoginComponent,
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
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],

})
export class AppModule { }
