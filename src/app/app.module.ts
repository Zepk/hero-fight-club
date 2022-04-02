import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeamComponent } from './components/team/team.component';
import { HeroService } from './services/hero.service';
import { HttpClientModule } from '@angular/common/http';
import { Utils } from './utils/utils';

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HeroService, Utils],
  bootstrap: [AppComponent]
})
export class AppModule { }
