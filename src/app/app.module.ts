import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ScoreboardService } from 'src/services/ScoreboardService';
import { ModalComponent } from './components/modal/modal.component';
import { NumberInputComponent } from './components/number-input/number-input.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TextInputComponent,
    ScoreboardComponent,
    SettingsComponent,
    ModalComponent,
    NumberInputComponent,
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [ScoreboardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
