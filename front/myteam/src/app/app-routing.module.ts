import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Clubs components
import { ClubsMenuComponent } from './components/body/clubs/clubs-menu/clubs-menu.component';
import { ClubsListComponent } from './components/body/clubs/clubs-list/clubs-list.component';
import { NewclubFormComponent } from './components/body/clubs/newclub-form/newclub-form.component';

//Games components
import { LiveGameComponent } from './components/body/game/live-game/live-game.component';
import { GameMenuComponent } from './components/body/game/game-menu/game-menu.component';
import { NewgameFormComponent } from './components/body/game/newgame-form/newgame-form.component';
import { GamesViewComponent } from './components/body/game/games-view/games-view.component';
import { MainPageComponent } from './components/body/game/live-game/main-page/livegame-main-page';
import { BoxscoreComponent } from './components/body/game/live-game/boxscore/boxscore.component';
import { PlayByPlayComponent } from './components/body/game/live-game/play-by-play/play-by-play.component';

//Players components
import { NewplayerFormComponent } from './components/body/players/newplayer-form/newplayer-form.component';
import { PlayersMenuComponent } from './components/body/players/players-menu/players-menu.component';
import { PlayersViewComponent } from './components/body/players/players-view/players-view.component';
import { UpdateplayerFormComponent } from './components/body/players/updateplayer-form/updateplayer-form.component';
import { PlayerProfileComponent } from './components/body/players/player-profile/player-profile.component';

//Leagues components
import { NewleagueFormComponent } from './components/body/leagues/newleague-form/newleague-form.component';
import { LeaguesViewComponent } from './components/body/leagues/leagues-view/leagues-view.component';
import { LeaguesMenuComponent } from './components/body/leagues/menu/leagues-menu.component';

//Teams components
import { TeamsMenuComponent } from './components/body/teams/teams-menu/teams-menu.component';
import { TeamsListComponent } from './components/body/teams/teams-list/teams-list.component';
import { NewteamFormComponent } from './components/body/teams/newteam-form/newteam-form.component';
import { UpdateteamFormComponent } from './components/body/teams/updateteam-form/updateteam-form.component';
import { TeamProfileComponent } from './components/body/teams/team-profile/team-profile.component';

//Stats components
import { StatsMenuComponent } from './components/body/stats/stats-menu/stats-menu.component';
import { TeamsStatsComponent } from './components/body/stats/teams-stats/teams-stats.component';
import { PlayersStatsComponent } from './components/body/stats/players-stats/players-stats.component';

//Users components
import { UsersListComponent } from './components/body/users/users-list/users-list.component';
import { UsersMenuComponent } from './components/body/users/users-menu/users-menu.component';
import { NewuserFormComponent } from './components/body/users/newuser-form/newuser-form.component';
import { EditUserComponent } from './components/body/users/edit-user/edit-user.component';

//Login component
import { LoginComponent } from './components/body/login/login.component';

//Main component
import { MainComponent } from './components/body/main/main.component';

//Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  //Login routes
  {path: 'login', component: LoginComponent},
  {path: 'home', component: MainComponent, canActivate: [AuthGuard],
    children : [
  //Clubs routes
    {path: 'clubs', component: ClubsMenuComponent, canActivate: [AuthGuard],
      children: [
        {path: 'clubs-list', component: ClubsListComponent},
        {path: 'new-club', component: NewclubFormComponent},
        {path: 'edit-club/:id', component: NewclubFormComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'clubs-list'}
      ]
    },
  //Game routes
    {path: 'live-game/:id', component: LiveGameComponent, canActivate: [AuthGuard],
    children: [
      {path: 'main-page', component: MainPageComponent},
      {path: 'boxscore', component: BoxscoreComponent},
      {path: 'play-by-play', component: PlayByPlayComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'main-page'}
    ]
    },
    {path: 'game-menu', component: GameMenuComponent, canActivate: [AuthGuard],
    children: [
      {path: 'new-game', component: NewgameFormComponent},
      {path: 'games-list', component: GamesViewComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'games-list'}
    ]
    },
  //Player routes
    {path: 'players', component: PlayersMenuComponent, canActivate: [AuthGuard],
    children: [
        {path: 'new-player', component: NewplayerFormComponent},
        {path: 'players-list', component: PlayersViewComponent},
        {path: 'edit-player/:id', component: UpdateplayerFormComponent},
        {path: 'player-profile/:id', component: PlayerProfileComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'players-list'}
      ]
    },
    //Teams routes
    {path: 'teams', component: TeamsMenuComponent, canActivate: [AuthGuard],
    children: [
        {path: 'new-team', component: NewteamFormComponent},
        {path: 'teams-list', component: TeamsListComponent},
        {path: 'edit-team/:id', component: UpdateteamFormComponent},
        {path: 'team-profile/:id', component: TeamProfileComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'teams-list'}
      ]
    },
  //Leagues routes
    {path: 'leagues', component: LeaguesMenuComponent, canActivate: [AuthGuard],
      children: [
        {path: 'new-league', component: NewleagueFormComponent},
        {path: 'leagues-list', component: LeaguesViewComponent},
        {path: 'edit-league/:id', component: NewleagueFormComponent},
        {path: '**', pathMatch: 'full', redirectTo: 'leagues-list'}
      ]
    },
  //Stats routes
    {path: 'stats', component: StatsMenuComponent, canActivate: [AuthGuard],
    children: [
      {path: 'teams-stats', component: TeamsStatsComponent},
      {path: 'players-stats', component: PlayersStatsComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'teams-stats'}
    ]
    },
    //Users routes
    {path: 'users', component: UsersMenuComponent, canActivate: [AuthGuard],
    children: [
      {path: 'users-list', component: UsersListComponent},
      {path: 'new-user', component: NewuserFormComponent},
      {path: 'edit-user/:id', component: EditUserComponent},
      {path: '**', pathMatch: 'full', redirectTo: 'users-list'}
    ]
    },
  //Default routes
    {path: '**', pathMatch: 'full', redirectTo: 'game-menu'},

  ]},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const APP_ROUTING = RouterModule.forRoot(routes, { useHash: true });
