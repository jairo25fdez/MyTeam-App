import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Models
import { LeagueModel } from '../../../../models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { GameModel } from '../../../../models/game.model';
import { TeamModel } from 'src/app/models/team.model';
import { Player_stats_gameModel } from 'src/app/models/player_stats_game.model';
import { Player_stats_seasonModel } from 'src/app/models/player_stats_season.model';
import { Team_stats_gameModel } from '../../../../models/team_stats_game.model';
import { Team_stats_seasonModel } from '../../../../models/team_stats_season.model';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { TeamsService } from '../../../../services/teams.service';
import { GamesService } from '../../../../services/games.service';
import { Player_stats_gamesService } from '../../../../services/player_stats_game.service';
import { Player_stats_seasonService } from '../../../../services/player_stats_season.service';
import { Team_stats_gameService } from '../../../../services/team_stats_game.service';
import { Team_stats_seasonService } from '../../../../services/team_stats_season.service';




@Component({
  selector: 'app-newgame-form',
  templateUrl: './newgame-form.component.html',
  styleUrls: ['./newgame-form.component.css']
})
export class NewgameFormComponent implements OnInit {

  form:FormGroup;
  
  league_selected = false;
  local_club_selected = false;
  visitor_club_selected = false;

  game:GameModel = new GameModel();
  clubs:ClubModel[];
  teams:TeamModel[];
  leagues:LeagueModel[];

  local_club:ClubModel;
  visitor_club:ClubModel;

  local_club_teams:TeamModel[] = [];
  visitor_club_teams:TeamModel[] = [];
  

  home_team_players = []; //Whole roster of the home team.
  visitor_team_players = []; //Whole roster of visitor team.

  selected_home_players = 0; //Save the number of home players selected for the game. It can't be up to 15.
  selected_home_players_5i = 0; //Save the number of starters home players.
  home_players = []; //Home team players selected to the game.
  home_starters = []; //A list of starters home players.

  selected_visitor_players = 0; //Save the number of visitor players selected for the game.
  selected_visitor_players_5i = 0; //Save the number of starters visitor players.
  visitor_players = []; //Visitor team players selected to the game.
  visitor_starters = []; //A list of starters visitor players.

  reset_local_select = true;


  constructor(private fb:FormBuilder, private leaguesService:LeaguesService, private team_stats_gameService:Team_stats_gameService, private team_stats_seasonService:Team_stats_seasonService, private player_stats_seasonService:Player_stats_seasonService, private player_stats_gameService:Player_stats_gamesService, private teamsService:TeamsService, private gamesService:GamesService, private clubsService:ClubsService, private router:Router) {

    this.leaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.clubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();

    

   }

  ngOnInit(): void {
  }

  createForm(){

    this.form = this.fb.group({
      game_league: ['',  ],
      game_date: ['', Validators.required],
      game_season: ['', Validators.required],
      home_club: ['', ],
      home_team_league: ['', ],

      visitor_club: ['', ],
      visitor_team_league: ['', ]
      
    });

  }

  get gamedateNoValid(){
    return this.form.get('game_date').invalid && this.form.get('game_date').touched;
  }

  get gameseasonNoValid(){
    return this.form.get('game_season').invalid && this.form.get('game_season').touched;
  }

  checkHomePlayers(event, checkBox, player_index) {

    //If we receive a starter player
    if(checkBox == "home_player_5i"){

      if(event.target.checked === true ){ //Trying to check the starter player.
        
        if(this.home_players.indexOf(player_index) != -1){ //If the player IS listed for the game.

          if(this.selected_home_players_5i < 5 ){ //If we found the player and have spaces to save it in the starters list.
            this.selected_home_players_5i++
            this.home_starters.push(player_index);
          }
          else{ //If we have no spaces for the new starter.
            event.target.checked = false;
          }

        }
        else{ //The player is not selected for the game so it can not be a starter.

          event.target.checked = false;
          
        }

      }
      else { //Trying to uncheck the starter player.

        if(this.selected_home_players_5i>0){
          this.selected_home_players_5i--;
        }

        this.home_starters.splice(this.home_starters.indexOf(player_index),1);
        
      }

    }
    //If we receive a player
    else{

      if(event.target.checked === true){ //User is trying to check the option
        if(this.selected_home_players < 15){
          this.home_players.push(player_index);
          this.selected_home_players++
        }
        else{
          event.target.checked = false;
        }
      }
      else{ //User is trying to deselect the option

        if(this.home_starters.indexOf(player_index) != -1){ //If we find the player in the starters list
          event.target.checked = true; //Cancel the uncheck
        }
        else{ //We don't find the player in starters list
          if(this.selected_home_players>0){
            //Borro al jugador de la convocatoria
            this.selected_home_players--;
          }
          this.home_players.splice(this.home_players.indexOf(player_index),1);
        }
        
      }

    }
    
  }

  checkVisitorPlayers(event, checkBox, player_index) {

    //If we receive a starter player
    if(checkBox == "visitor_player_5i"){

      if(event.target.checked === true ){ //Trying to check the starter player.
        
        if(this.visitor_players.indexOf(player_index) != -1){ //If the player IS listed for the game.

          if(this.selected_visitor_players_5i < 5 ){ //If we found the player and have spaces to save it in the starters list.
            this.selected_visitor_players_5i++
            this.visitor_starters.push(player_index);
          }
          else{ //If we have no spaces for the new starter.
            event.target.checked = false;
          }

        }
        else{ //The player is not selected for the game so it can not be a starter.

          event.target.checked = false;
          
        }

      }
      else { //Trying to uncheck the starter player.

        if(this.selected_visitor_players_5i>0){
          this.selected_visitor_players_5i--;
        }

        this.visitor_starters.splice(this.visitor_starters.indexOf(player_index),1);
        
      }

    }
    //If we receive a player
    else{

      if(event.target.checked === true){ //User is trying to check the option
        if(this.selected_visitor_players < 15){
          this.visitor_players.push(player_index);
          this.selected_visitor_players++
        }
        else{
          event.target.checked = false;
        }
      }
      else{ //User is trying to deselect the option

        if(this.visitor_starters.indexOf(player_index) != -1){ //If we find the player in the starters list
          event.target.checked = true; //Cancel the uncheck
        }
        else{ //We don't find the player in starters list
          if(this.selected_visitor_players>0){
            //Borro al jugador de la convocatoria
            this.selected_visitor_players--;
          }
          this.visitor_players.splice(this.visitor_players.indexOf(player_index),1);
        }
        
      }

    }

    //console.log("VISITOR PLAYERS INDEX: "+this.visitor_players);
    //console.log("VISITOR STARTERS INDEX: "+this.visitor_starters);
    //console.log("");

  }

  setGameLeague(league_index){

    if(league_index != "friendly_game"){

      this.game.league = {
        league_id: this.leagues[league_index]._id,
        league_name: this.leagues[league_index].name
      };

      this.league_selected = true;
      this.local_club_selected = false;
      this.visitor_club_selected = false;

      //Load the teams that belong to the selected league.
      this.setTeams(this.game.league.league_id);

    }
    else{
      this.league_selected = false;
    }

    //Reset the values everytime we change the league.
    this.local_club_teams = [];
    this.visitor_club_teams = [];
  
    this.home_team_players = [];
    this.visitor_team_players = [];

    
    

  }

  setLocalClub(club_index:number){
    this.local_club_selected = true;

    this.teamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.local_club_teams = res;
    });

    this.local_club = this.clubs[club_index];

    this.home_team_players = [];

    this.form.get('home_team_league').setValue('');

  }

  setVisitorClub(club_index:number){
    this.visitor_club_selected = true;

    this.teamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.visitor_club_teams = res;
    });

    this.visitor_club = this.clubs[club_index];

    this.visitor_team_players = [];

    this.form.get('visitor_team_league').setValue('');

  }

  selectLocalTeam(team_index:string){

    this.game.home_team = {
      club_id: this.local_club_teams[team_index].club.club_id,
      club_name: this.local_club_teams[team_index].club.club_name,
      club_img: this.local_club_teams[team_index].club.club_img,
      club_acronym: this.local_club.acronym,
      team_id: this.local_club_teams[team_index]._id
    } 

    this.home_team_players = this.local_club_teams[team_index].roster;

    this.home_team_players.sort(function(a,b){
      return a.player_number-b.player_number;
    });

  }

  selectVisitorTeam(team_index:string){

    this.game.visitor_team = {
      club_id: this.visitor_club_teams[team_index].club.club_id,
      club_name: this.visitor_club_teams[team_index].club.club_name,
      club_img: this.visitor_club_teams[team_index].club.club_img,
      club_acronym: this.visitor_club.acronym,
      team_id: this.visitor_club_teams[team_index]._id
    }

    this.visitor_team_players = this.visitor_club_teams[team_index].roster;

    this.visitor_team_players.sort(function(a,b){
      return a.player_number-b.player_number;
    });

  }

  setTeams(league_id){

    this.teamsService.getTeams("?league.league_id="+league_id).then((res:TeamModel[]) => {
      this.teams = res;
    });

  }

  setLocalTeam(team_index:number){

    this.clubsService.getClubs("?_id="+this.teams[team_index].club.club_id).then( (res:ClubModel[]) => {

      let team_acronym = res[0].acronym;

      this.game.home_team = {
        club_id: this.teams[team_index].club.club_id,
        club_name: this.teams[team_index].club.club_name,
        club_img: this.teams[team_index].club.club_img,
        club_acronym: team_acronym,
        team_id: this.teams[team_index]._id
      };

    });

    this.home_team_players = this.teams[team_index].roster;

    this.home_team_players.sort(function(a,b){
      return a.player_number-b.player_number;
    });

  }

  setVisitorTeam(team_index:number){

    this.clubsService.getClubs("?_id="+this.teams[team_index].club.club_id).then( (res:ClubModel[]) => {

      let team_acronym = res[0].acronym;

      this.game.visitor_team = {
        club_id: this.teams[team_index].club.club_id,
        club_name: this.teams[team_index].club.club_name,
        club_img: this.teams[team_index].club.club_img,
        club_acronym: team_acronym,
        team_id: this.teams[team_index]._id
      };

    });

    this.visitor_team_players = this.teams[team_index].roster;

    this.visitor_team_players.sort(function(a,b){
      return a.player_number-b.player_number;
    });

  }


  createGame(){

    if(this.form.invalid){

      return Object.values(this.form.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{

      if( (this.home_players.length < 5) ||  (this.visitor_players.length < 5) || (this.home_starters.length < 5) || (this.visitor_starters.length < 5) ){ //Need to check if the fields are filled.

        Swal.fire({
          title: 'Error.',
          text: 'Seleccione al menos 5 jugadores por equipo e indique los titulares.',
          icon: 'error'
        });

      }
      else{ //The game has the correct fields.

        //Initialize the fields of the game

        this.game.home_team_score = 0;
        this.game.visitor_team_score = 0;
        this.game.winner_team = {
          team_id: this.game.home_team.team_id,
          club_name: "",
          club_img: ""
        },
        this.game.loser_team = {
          team_id: this.game.visitor_team.team_id,
          club_name: "",
          club_img: ""
        },
        this.game.time_played = {
          minute: 0,
          second: 0,
          quarter: 0
        };
        this.game.overtime = false;
        this.game.overtime_count = 0;
        //this.game.play_by_play = [{}];
        
        //Create the game.
        this.gamesService.createGame(this.game).then( res => {

          //Get the game to check the ID.
          this.gamesService.getGames("?date="+this.game.date+"&home_team.team_id="+this.game.home_team.team_id+"&visitor_team.team_id="+this.game.visitor_team.team_id).then( (games:GameModel[]) => {
          
            //Create the home team stats for the game
            let home_team_stats_game:Team_stats_gameModel = {
              team_id: this.game.home_team.team_id,
              team_name: this.game.home_team.club_name,
              game_id: games[0]._id,
              league_id: this.game.league.league_id,
              season: this.game.season,
              time_played: {
                  minutes: 0,
                  seconds: 0,
              },
              points: 0,
              t2_made: 0,
              t2_attempted: 0,
              t2_percentage: 0,
              t3_made: 0,
              t3_attempted: 0,
              t3_percentage: 0,
              t1_made: 0,
              t1_attempted: 0,
              t1_percentage: 0,
              shots_list: {
                lc3: {made: 0, attempted: 0},
                le3: {made: 0, attempted: 0},
                c3: {made: 0, attempted: 0},
                re3: {made: 0, attempted: 0},
                rc3: {made: 0, attempted: 0},
                lmc2: {made: 0, attempted: 0},
                lme2: {made: 0, attempted: 0},
                cm2: {made: 0, attempted: 0},
                rme2: {made: 0, attempted: 0},
                rmc2: {made: 0, attempted: 0},
                lp2: {made: 0, attempted: 0},
                rp2: {made: 0, attempted: 0},
                lft2: {made: 0, attempted: 0},
                rft2: {made: 0, attempted: 0}
              },
              total_rebounds: 0,
              defensive_rebounds: 0,
              offensive_rebounds: 0,
              assists: 0,
              steals: 0,
              turnovers: 0,
              blocks_made: 0,
              blocks_received: 0,
              fouls_made: 0,
              fouls_received: 0,
              possessions: 0
            };

            this.team_stats_gameService.createTeam_stats_game(home_team_stats_game).catch( (err:HttpErrorResponse) => {

              Swal.fire({
                title: 'Error.',
                text: 'Error al intentar crear las estadísticas para el equipo local.',
                icon: 'error'
              });
  
            });

            //Create the visitor team stats for the game
            let visitor_team_stats_game:Team_stats_gameModel = {
              team_id: this.game.visitor_team.team_id,
              team_name: this.game.visitor_team.club_name,
              game_id: games[0]._id,
              league_id: this.game.league.league_id,
              season: this.game.season,
              time_played: {
                  minutes: 0,
                  seconds: 0,
              },
              points: 0,
              t2_made: 0,
              t2_attempted: 0,
              t2_percentage: 0,
              t3_made: 0,
              t3_attempted: 0,
              t3_percentage: 0,
              t1_made: 0,
              t1_attempted: 0,
              t1_percentage: 0,
              shots_list: {
                lc3: {made: 0, attempted: 0},
                le3: {made: 0, attempted: 0},
                c3: {made: 0, attempted: 0},
                re3: {made: 0, attempted: 0},
                rc3: {made: 0, attempted: 0},
                lmc2: {made: 0, attempted: 0},
                lme2: {made: 0, attempted: 0},
                cm2: {made: 0, attempted: 0},
                rme2: {made: 0, attempted: 0},
                rmc2: {made: 0, attempted: 0},
                lp2: {made: 0, attempted: 0},
                rp2: {made: 0, attempted: 0},
                lft2: {made: 0, attempted: 0},
                rft2: {made: 0, attempted: 0}
              },
              total_rebounds: 0,
              defensive_rebounds: 0,
              offensive_rebounds: 0,
              assists: 0,
              steals: 0,
              turnovers: 0,
              blocks_made: 0,
              blocks_received: 0,
              fouls_made: 0,
              fouls_received: 0,
              possessions: 0
            };

            this.team_stats_gameService.createTeam_stats_game(visitor_team_stats_game).catch( (err:HttpErrorResponse) => {
              Swal.fire({
                title: 'Error.',
                text: 'Error al intentar crear las estadísticas para el equipo visitante.',
                icon: 'error'
              });
            });

            //Create the home team stats for the season if it does not exists
            this.team_stats_seasonService.getTeams_stats_season("?team_id="+this.game.home_team.team_id+"&season="+this.game.season).then( (team_stats:Team_stats_seasonModel[]) => {
              if(team_stats.length == 0){

                let home_team_stats_season = new Team_stats_seasonModel();

                home_team_stats_season = {
                  team_id: this.game.home_team.team_id,
                  league_id: this.game.league.league_id,
                  season: this.game.season,
                  team_name: this.game.home_team.club_name,
                  time_played: {
                      minutes: 0,
                      seconds: 0,
                  },
                  games_played: 0,
                  wins: 0,
                  losses: 0,
                  win_percentage: 0,
                  points_stats: {
                    total_points: 0,
                    average_points: 0,
                    points_per_minute: 0,
                    points_per_field_shot: 0,
                    points_per_shot_t2: 0,
                    points_per_shot_t3: 0,
                    points_per_possesion: 0,
                  },
                  shots_stats: {
                      total_shots: 0,
                      total_FG_shots: 0,
                      shots_list: {
                        lc3: {made: 0, attempted: 0},
                        le3: {made: 0, attempted: 0},
                        c3: {made: 0, attempted: 0},
                        re3: {made: 0, attempted: 0},
                        rc3: {made: 0, attempted: 0},
                        lmc2: {made: 0, attempted: 0},
                        lme2: {made: 0, attempted: 0},
                        cm2: {made: 0, attempted: 0},
                        rme2: {made: 0, attempted: 0},
                        rmc2: {made: 0, attempted: 0},
                        lp2: {made: 0, attempted: 0},
                        rp2: {made: 0, attempted: 0},
                        lft2: {made: 0, attempted: 0},
                        rft2: {made: 0, attempted: 0}
                      },
                      eFG: 0,
                      fg_percentage: 0,
                      t2_stats: {
                          t2_made: 0,
                          t2_attempted: 0,
                          t2_total: 0,
                          t2_percentage: 0,
                          t2_volume_percentage: 0,
                      },
                      t3_stats: {
                          t3_made: 0,
                          t3_attempted: 0,
                          t3_total: 0,
                          t3_percentage: 0,
                          t3_volume_percentage: 0,
                      },
                      t1_stats: {
                          t1_made: 0,
                          t1_attempted: 0,
                          t1_percentage: 0,
                          t1_volume_percentage: 0,
                      }
                  },
                  assists_stats: {
                      total_assists: 0,
                      assists_percentage: 0,
                      assists_per_lost: 0,
                  },
                  steals_stats: {
                      total_steals: 0,
                      steals_per_minute: 0,
                      steals_per_game: 0,
                  },
                  lost_balls_stats: {
                      total_losts: 0,
                      turnovers_per_minute: 0
                  },
                  rebounds_stats: {
                      total_rebounds: 0,
                      average_rebounds: 0,
                      offensive_rebounds: 0,
                      defensive_rebounds: 0,
                      total_rebounds_per_minute: 0,
                      off_rebounds_per_minute: 0,
                      def_rebounds_per_minute: 0,
                  },
                  blocks_stats: {
                      total_blocks_made: 0,
                      total_blocks_received: 0,
                      blocks_made_per_game: 0,
                      blocks_received_per_game: 0,
                      blocks_received_per_minute: 0,
                      blocks_made_per_minute: 0,
                  },
                  fouls_stats: {
                      total_fouls_made: 0,
                      fouls_made_per_minute: 0,
                      total_fouls_received: 0,
                      fouls_received_per_minute: 0,
                  }

                };

                this.team_stats_seasonService.createTeam_stats_season(home_team_stats_season).catch( (err:HttpErrorResponse) => {
                  Swal.fire({
                    title: 'Error.',
                    text: 'Error al intentar crear las estadísticas de temporada del equipo local.',
                    icon: 'error'
                  });
                });

              }
            });

            //Create the visitor team stats for the season if it does not exists
            this.team_stats_seasonService.getTeams_stats_season("?team_id="+this.game.visitor_team.team_id+"&season="+this.game.season).then( (team_stats:Team_stats_seasonModel[]) => {
              if(team_stats.length == 0){

                let visitor_team_stats_season = new Team_stats_seasonModel();

                visitor_team_stats_season = {
                  team_id: this.game.visitor_team.team_id,
                  league_id: this.game.league.league_id,
                  season: this.game.season,
                  team_name: this.game.visitor_team.club_name,
                  time_played: {
                      minutes: 0,
                      seconds: 0,
                  },
                  games_played: 0,
                  wins: 0,
                  losses: 0,
                  win_percentage: 0,
                  points_stats: {
                    total_points: 0,
                    average_points: 0,
                    points_per_minute: 0,
                    points_per_field_shot: 0,
                    points_per_shot_t2: 0,
                    points_per_shot_t3: 0,
                    points_per_possesion: 0,
                  },
                  shots_stats: {
                      total_shots: 0,
                      total_FG_shots: 0,
                      shots_list: {
                        lc3: {made: 0, attempted: 0},
                        le3: {made: 0, attempted: 0},
                        c3: {made: 0, attempted: 0},
                        re3: {made: 0, attempted: 0},
                        rc3: {made: 0, attempted: 0},
                        lmc2: {made: 0, attempted: 0},
                        lme2: {made: 0, attempted: 0},
                        cm2: {made: 0, attempted: 0},
                        rme2: {made: 0, attempted: 0},
                        rmc2: {made: 0, attempted: 0},
                        lp2: {made: 0, attempted: 0},
                        rp2: {made: 0, attempted: 0},
                        lft2: {made: 0, attempted: 0},
                        rft2: {made: 0, attempted: 0}
                      },
                      eFG: 0,
                      fg_percentage: 0,
                      t2_stats: {
                          t2_made: 0,
                          t2_attempted: 0,
                          t2_total: 0,
                          t2_percentage: 0,
                          t2_volume_percentage: 0,
                      },
                      t3_stats: {
                          t3_made: 0,
                          t3_attempted: 0,
                          t3_total: 0,
                          t3_percentage: 0,
                          t3_volume_percentage: 0,
                      },
                      t1_stats: {
                          t1_made: 0,
                          t1_attempted: 0,
                          t1_percentage: 0,
                          t1_volume_percentage: 0,
                      }
                  },
                  assists_stats: {
                      total_assists: 0,
                      assists_percentage: 0,
                      assists_per_lost: 0,
                  },
                  steals_stats: {
                      total_steals: 0,
                      steals_per_minute: 0,
                      steals_per_game: 0,
                  },
                  lost_balls_stats: {
                      total_losts: 0,
                      turnovers_per_minute: 0
                  },
                  rebounds_stats: {
                      total_rebounds: 0,
                      average_rebounds: 0,
                      offensive_rebounds: 0,
                      defensive_rebounds: 0,
                      total_rebounds_per_minute: 0,
                      off_rebounds_per_minute: 0,
                      def_rebounds_per_minute: 0
                  },
                  blocks_stats: {
                      total_blocks_made: 0,
                      total_blocks_received: 0,
                      blocks_made_per_game: 0,
                      blocks_received_per_game: 0,
                      blocks_received_per_minute: 0,
                      blocks_made_per_minute: 0,
                  },
                  fouls_stats: {
                      total_fouls_made: 0,
                      fouls_made_per_minute: 0,
                      total_fouls_received: 0,
                      fouls_received_per_minute: 0,
                  }

                };

                this.team_stats_seasonService.createTeam_stats_season(visitor_team_stats_season).catch( (err:HttpErrorResponse) => {
                  Swal.fire({
                    title: 'Error.',
                    text: 'Error al intentar crear las estadísticas de temporada del equipo visitante.',
                    icon: 'error'
                  });
                });

              }
            });

            //For every home player create a stats document.
            for(let player_index of this.home_players){

              let player_starter:boolean = false;
    
              //Check if the player is a starter in the game.
              if(this.home_starters.indexOf(player_index) != -1){
                player_starter = true;
              }
    
              let player_stats_game:Player_stats_gameModel = {
                player_id: this.home_team_players[player_index].player_id,
                game_id: games[0]._id,
                league_id: this.game.league.league_id,
                season: this.game.season,
                team_id: this.game.home_team.team_id,
                starter: player_starter,
                player_name: this.home_team_players[player_index].player_name,
                player_lastName: this.home_team_players[player_index].player_last_name,
                player_img: this.home_team_players[player_index].player_img,
                player_number: this.home_team_players[player_index].player_number,
                time_played: {
                  minutes: 0,
                  seconds: 0
                },
                points: 0,
                t2_made: 0,
                t2_attempted: 0,
                t2_percentage: 0,
                t3_made: 0,
                t3_attempted: 0,
                t3_percentage: 0,
                t1_made: 0,
                t1_attempted: 0,
                t1_percentage: 0,
                shots_list: {
                  lc3: {made: 0, attempted: 0},
                  le3: {made: 0, attempted: 0},
                  c3: {made: 0, attempted: 0},
                  re3: {made: 0, attempted: 0},
                  rc3: {made: 0, attempted: 0},
                  lmc2: {made: 0, attempted: 0},
                  lme2: {made: 0, attempted: 0},
                  cm2: {made: 0, attempted: 0},
                  rme2: {made: 0, attempted: 0},
                  rmc2: {made: 0, attempted: 0},
                  lp2: {made: 0, attempted: 0},
                  rp2: {made: 0, attempted: 0},
                  lft2: {made: 0, attempted: 0},
                  rft2: {made: 0, attempted: 0}
                },
                total_rebounds: 0,
                defensive_rebounds: 0,
                offensive_rebounds: 0,
                assists: 0,
                steals: 0,
                turnovers: 0,
                blocks_made: 0,
                blocks_received: 0,
                fouls_made: 0,
                fouls_received: 0,
                usage: 0
              };
    
              //Post the player stats for the game.
              this.player_stats_gameService.createPlayer_stats_game(player_stats_game).catch( (err:HttpErrorResponse) => {
                Swal.fire({
                  title: 'Error.',
                  text: 'Error al tratar de crear las estadísticas del jugador para el partido.',
                  icon: 'error'
                });
              });

              //If the player has not season stats document we create it.
              this.player_stats_seasonService.getPlayer_stats_seasons("?player_id="+this.home_team_players[player_index].player_id+"&season="+this.game.season).then( (players_stats_season:Player_stats_seasonModel[]) => {

                if(players_stats_season.length == 0){
                  let player_stats_season = new Player_stats_seasonModel();

                  player_stats_season = {
                    player_id: player_stats_game.player_id,
                    team_id: player_stats_game.team_id,
                    league_id: this.game.league.league_id,
                    season: this.game.season,
                    player_name: player_stats_game.player_name,
                    player_lastName: player_stats_game.player_lastName,
                    player_img: player_stats_game.player_img,
                    time_played: {
                      minutes: 0,
                      seconds: 0,
                      average: 0
                    },
                    games_played: 0,
                    wins: 0,
                    losses: 0,
                    win_percentage: 0,
                    points_stats: {
                      total_points: 0,
                      average_points: 0,
                      points_per_minute: 0,
                      points_per_field_shot: 0,
                      points_per_shot_t2: 0,
                      points_per_shot_t3: 0,
                      //points_per_possesion: 0
                    },
                    shots_stats: {
                      total_shots: 0, 
                      total_FG_shots: 0,
                      shots_list: {
                        lc3: {made: 0, attempted: 0},
                        le3: {made: 0, attempted: 0},
                        c3: {made: 0, attempted: 0},
                        re3: {made: 0, attempted: 0},
                        rc3: {made: 0, attempted: 0},
                        lmc2: {made: 0, attempted: 0},
                        lme2: {made: 0, attempted: 0},
                        cm2: {made: 0, attempted: 0},
                        rme2: {made: 0, attempted: 0},
                        rmc2: {made: 0, attempted: 0},
                        lp2: {made: 0, attempted: 0},
                        rp2: {made: 0, attempted: 0},
                        lft2: {made: 0, attempted: 0},
                        rft2: {made: 0, attempted: 0}
                      },
                      fg_percentage: 0,
                      eFG: 0, 
                      t2_stats: {
                          t2_made: 0,
                          t2_attempted: 0,
                          //t2_total: 0,
                          t2_percentage: 0,
                          t2_volume_percentage: 0,
                      },
                      t3_stats: {
                          t3_made: 0,
                          t3_attempted:0,
                          //t3_total: 0, // = t3_made + t3_attempted
                          t3_percentage: 0, // %t3
                          t3_volume_percentage: 0, // %t3 compared to total shots, = total shots / t3_total
                      },
                      t1_stats: {
                          t1_made: 0,
                          t1_attempted: 0,
                          t1_percentage: 0,
                          t1_volume_percentage: 0,
                      }
                    },
                    assists_stats: {
                      total_assists: 0,
                      assists_percentage: 0,
                      assists_per_lost: 0
                    },
                    steals_stats: {
                      total_steals: 0,
                      steals_per_minute: 0,
                      steals_per_game: 0
                    },
                    lost_balls_stats: {
                      total_losts: 0,
                      turnovers_per_minute: 0
                    },
                    rebounds_stats: {
                      total_rebounds: 0,
                      average_rebounds: 0,
                      offensive_rebounds: 0,
                      defensive_rebounds: 0,
                      total_rebounds_per_minute: 0,
                      off_rebounds_per_minute: 0,
                      def_rebounds_per_minute: 0,
                      //rebounds_percentage: 0
                    },
                    blocks_stats: {
                      total_blocks_made: 0,
                      total_blocks_received: 0,
                      blocks_made_per_game: 0,
                      blocks_received_per_game: 0,
                      blocks_received_per_minute: 0,
                      blocks_made_per_minute: 0,
                    },
                    usage: 0,
                    fouls_stats: {
                      total_fouls_made: 0,
                      fouls_made_per_minute: 0,
                      total_fouls_received: 0,
                      fouls_received_per_minute: 0
                    }

                  };

                  this.player_stats_seasonService.createPlayer_stats_season(player_stats_season).catch( (err:HttpErrorResponse) => {
                    Swal.fire({
                      title: 'Error.',
                      text: 'Error al crear las estadísticas de la temporada del jugador.',
                      icon: 'error'
                    });
                  });

                }

              });
              
            }
            
            //For every visitor player create a stats document.
            for(let player_index of this.visitor_players){

              let player_starter:boolean = false;
    
              //Check if the player is a starter in the game.
              if(this.visitor_starters.indexOf(player_index) != -1){
                player_starter = true;
              }
    
              let player_stats_game:Player_stats_gameModel = {
                player_id: this.visitor_team_players[player_index].player_id,
                game_id: games[0]._id,
                league_id: this.game.league.league_id,
                season: this.game.season,
                team_id: this.game.visitor_team.team_id,
                starter: player_starter,
                player_name: this.visitor_team_players[player_index].player_name,
                player_lastName: this.visitor_team_players[player_index].player_last_name,
                player_img: this.visitor_team_players[player_index].player_img,
                player_number: this.visitor_team_players[player_index].player_number,
                time_played: {
                  minutes: 0,
                  seconds: 0
                },
                points: 0,
                t2_made: 0,
                t2_attempted: 0,
                t2_percentage: 0,
                t3_made: 0,
                t3_attempted: 0,
                t3_percentage: 0,
                t1_made: 0,
                t1_attempted: 0,
                t1_percentage: 0,
                shots_list: {
                  lc3: {made: 0, attempted: 0},
                  le3: {made: 0, attempted: 0},
                  c3: {made: 0, attempted: 0},
                  re3: {made: 0, attempted: 0},
                  rc3: {made: 0, attempted: 0},
                  lmc2: {made: 0, attempted: 0},
                  lme2: {made: 0, attempted: 0},
                  cm2: {made: 0, attempted: 0},
                  rme2: {made: 0, attempted: 0},
                  rmc2: {made: 0, attempted: 0},
                  lp2: {made: 0, attempted: 0},
                  rp2: {made: 0, attempted: 0},
                  lft2: {made: 0, attempted: 0},
                  rft2: {made: 0, attempted: 0}
                },
                total_rebounds: 0,
                defensive_rebounds: 0,
                offensive_rebounds: 0,
                assists: 0,
                steals: 0,
                turnovers: 0,
                blocks_made: 0,
                blocks_received: 0,
                fouls_made: 0,
                fouls_received: 0,
                usage: 0,
              };
    
              //Post the player stats for the game.
              this.player_stats_gameService.createPlayer_stats_game(player_stats_game).catch( (err:HttpErrorResponse) => {
                Swal.fire({
                  title: 'Error.',
                  text: 'Error al tratar de crear las estadísticas del jugador visitante para el partido.',
                  icon: 'error'
                });
              });
              
              //If the player has not season stats document we create it.
              this.player_stats_seasonService.getPlayer_stats_seasons("?player_id="+this.home_team_players[player_index].player_id+"&season="+this.game.season).then( (players_stats_season:Player_stats_seasonModel[]) => {

                if(players_stats_season.length == 0){
                  let player_stats_season = new Player_stats_seasonModel();

                  player_stats_season = {
                    player_id: player_stats_game.player_id,
                    team_id: player_stats_game.team_id,
                    league_id: this.game.league.league_id,
                    season: this.game.season,
                    player_name: player_stats_game.player_name,
                    player_lastName: player_stats_game.player_lastName,
                    player_img: player_stats_game.player_img,
                    time_played: {
                      minutes: 0,
                      seconds: 0,
                      average: 0
                    },
                    games_played: 0,
                    wins: 0,
                    losses: 0,
                    win_percentage: 0,
                    points_stats: {
                      total_points: 0,
                      average_points: 0,
                      points_per_minute: 0,
                      points_per_field_shot: 0,
                      points_per_shot_t2: 0,
                      points_per_shot_t3: 0,
                      //points_per_possesion: 0
                    },
                    shots_stats: {
                      total_shots: 0, 
                      total_FG_shots: 0,
                      shots_list: {
                        lc3: {made: 0, attempted: 0},
                        le3: {made: 0, attempted: 0},
                        c3: {made: 0, attempted: 0},
                        re3: {made: 0, attempted: 0},
                        rc3: {made: 0, attempted: 0},
                        lmc2: {made: 0, attempted: 0},
                        lme2: {made: 0, attempted: 0},
                        cm2: {made: 0, attempted: 0},
                        rme2: {made: 0, attempted: 0},
                        rmc2: {made: 0, attempted: 0},
                        lp2: {made: 0, attempted: 0},
                        rp2: {made: 0, attempted: 0},
                        lft2: {made: 0, attempted: 0},
                        rft2: {made: 0, attempted: 0}
                      },
                      fg_percentage: 0,
                      eFG: 0, 
                      t2_stats: {
                          t2_made: 0,
                          t2_attempted: 0,
                          //t2_total: 0,
                          t2_percentage: 0,
                          t2_volume_percentage: 0,
                      },
                      t3_stats: {
                          t3_made: 0,
                          t3_attempted:0,
                          //t3_total: 0, // = t3_made + t3_attempted
                          t3_percentage: 0, // %t3
                          t3_volume_percentage: 0, // %t3 compared to total shots, = total shots / t3_total
                      },
                      t1_stats: {
                          t1_made: 0,
                          t1_attempted: 0,
                          t1_percentage: 0,
                          t1_volume_percentage: 0,
                      }
                    },
                    assists_stats: {
                      total_assists: 0,
                      assists_percentage: 0,
                      assists_per_lost: 0
                    },
                    steals_stats: {
                      total_steals: 0,
                      steals_per_minute: 0,
                      steals_per_game: 0
                    },
                    lost_balls_stats: {
                      total_losts: 0,
                      turnovers_per_minute: 0
                    },
                    rebounds_stats: {
                      total_rebounds: 0,
                      average_rebounds: 0,
                      offensive_rebounds: 0,
                      defensive_rebounds: 0,
                      total_rebounds_per_minute: 0,
                      off_rebounds_per_minute: 0,
                      def_rebounds_per_minute: 0,
                      //rebounds_percentage: 0
                    },
                    blocks_stats: {
                      total_blocks_made: 0,
                      total_blocks_received: 0,
                      blocks_made_per_game: 0,
                      blocks_received_per_game: 0,
                      blocks_received_per_minute: 0,
                      blocks_made_per_minute: 0,
                    },
                    usage: 0,
                    fouls_stats: {
                      total_fouls_made: 0,
                      fouls_made_per_minute: 0,
                      total_fouls_received: 0,
                      fouls_received_per_minute: 0
                    }

                  };

                  this.player_stats_seasonService.createPlayer_stats_season(player_stats_season).catch( (err:HttpErrorResponse) => {
                    Swal.fire({
                      title: 'Error.',
                      text: 'Error al crear las estadísticas de la temporada del jugador.',
                      icon: 'error'
                    });
                  });

                }

              });
              

            }

            //console.log("QUIERO IR AL PARTIDO CON ID: "+games[0]._id);

            //Navigate to game component
            this.router.navigateByUrl('/home/live-game/'+games[0]._id);
          
          })
          .catch( (err:HttpErrorResponse) => {

            Swal.fire({
              title: 'Error.',
              text: 'Error al intentar traer el partido de la base de datos.',
              icon: 'error'
            });

          });

        })
        .catch( (err:HttpErrorResponse) => {

        Swal.fire({
          title: 'Error.',
          text: 'Error al crear el partido en la base de datos.',
          icon: 'error'
        });

      });

      }

    }
    

  }

}
