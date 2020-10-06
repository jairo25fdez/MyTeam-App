import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Clubs components
import { ClubsMenuComponent } from './components/body/clubs/clubs-menu/clubs-menu.component';
import { ClubsListComponent } from './components/body/clubs/clubs-list/clubs-list.component';

//Games components
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';

//Players components
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';
import { PlayersMenuComponent } from './components/body/players/players-menu/players-menu.component';
import { PlayersViewComponent } from './components/body/players/players-view/players-view.component';

//Leagues components
import { NewleagueFormComponent } from './components/body/leagues/newleague-form/newleague-form.component';
import { LeaguesViewComponent } from './components/body/leagues/leagues-view/leagues-view.component';
import { LeaguesMenuComponent } from './components/body/leagues/menu/leagues-menu.component';

const routes: Routes = [
  //Clubs routes
  {path: 'clubs', component: ClubsMenuComponent,
    children: [
      {path: 'clubs-list', component: ClubsListComponent},
      //{path: 'new-club', component: NewClubFormComponent},
      //{path: 'edit-club/:id', component: NewClubFormComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'clubs-list'}
    ]
  },
  //Game routes
    {path: 'live-game', component: LiveGameComponent},
    {path: 'game-menu', component: GameMenuComponent},
  //Player routes
    {path: 'players', component: PlayersMenuComponent,
    children: [
        {path: 'new-player', component: NewplayerFormComponent},
        {path: 'players-view', component: PlayersViewComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'players-view'}
      ]
    },
  //Leagues routes
    {path: 'leagues', component: LeaguesMenuComponent,
      children: [
        {path: 'new-league', component: NewleagueFormComponent},
        {path: 'leagues-view', component: LeaguesViewComponent},
        {path: 'edit-league/:id', component: NewleagueFormComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'leagues-view'}
      ]
    },
    
  //Default routes
    {path: '**', pathMatch: 'full', redirectTo: ''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const APP_ROUTING = RouterModule.forRoot(routes, { useHash: true });
