import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Models
import { LeagueModel } from 'src/app/models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from 'src/app/models/team.model';


//Services
import { LeaguesService } from 'src/app/services/leagues.service';
import { ClubsService } from 'src/app/services/clubs.service';
import { PlayersService } from 'src/app/services/players.service';
import { TeamsService } from 'src/app/services/teams.service';


@Component({
  selector: 'app-players-view',
  templateUrl: './players-view.component.html',
  styleUrls: ['./players-view.component.css']
})
export class PlayersViewComponent implements OnInit {

  form:FormGroup;
  leagues: LeagueModel[];
  clubs:ClubModel[];
  teams:TeamModel[];
  players:PlayerModel[];

  constructor( private fb:FormBuilder, private playersService:PlayersService, private clubsService:ClubsService, private leaguesService:LeaguesService, private PlayersService:PlayersService ) { 

    this.PlayersService.getPlayers().then((res:PlayerModel[]) => {
      this.players = res;
    });

    this.leaguesService.getLeagues("?sort=name").then( (leagues:LeagueModel[]) => {
      this.leagues = leagues;
    });

    this.clubsService.getClubs("?sort=name").then( (clubs:ClubModel[]) => {
      this.clubs = clubs;
    });


    this.createForm();

  }

  ngOnInit(): void {

    

  }

  createForm(){

    this.form = this.fb.group({
      leagues: [''],
      clubs: ['']
    });

  }

  searchPlayers(){

    this.playersService.getPlayers("?teams.league_id="+this.form.get('leagues').value+"&teams.club_id="+this.form.get('clubs').value).then( (players:PlayerModel[]) => {
      this.players = players;
    });
    
  }

  deletePlayer(player:PlayerModel){


      Swal.fire({
        title: 'Espere',
        text: 'Borrando jugador...',
        icon: 'info',
        allowOutsideClick: false
      });
  
      Swal.showLoading();

      console.log("PLAYER: "+player);
  
      this.PlayersService.deletePlayer(player._id).then(res => {
  
        Swal.fire({
          title: 'Jugador borrado correctamente.',
          icon: 'success'
        });
  
        //Reload Leagues info when delete is successful
        this.PlayersService.getPlayers().then((res:PlayerModel[]) => {
          this.players = res;
        });
  
      })
      .catch( (err: HttpErrorResponse) => {
        console.error('Ann error occurred: ', err.error);
        Swal.fire({
          title: 'Error al borrar el jugador.',
          icon: 'error'
        });
      });
  
  
    
  }

}
