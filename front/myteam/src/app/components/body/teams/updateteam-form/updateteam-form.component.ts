import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { TeamsService } from '../../../../services/teams.service';

//Models
import { ClubModel } from '../../../../models/club.model';
import { LeagueModel } from '../../../../models/league.model';
import { TeamModel } from '../../../../models/team.model';

@Component({
  selector: 'app-updateteam-form',
  templateUrl: './updateteam-form.component.html',
  styleUrls: ['./updateteam-form.component.css']
})
export class UpdateteamFormComponent implements OnInit {

  formulario: FormGroup;
  team:TeamModel = new TeamModel();

  clubs:ClubModel[];
  leagues:LeagueModel[];

  constructor(private TeamsService:TeamsService, private ClubsService:ClubsService, private LeaguesService:LeaguesService, private route:ActivatedRoute, private fb:FormBuilder) { 
    
    const id = this.route.snapshot.paramMap.get('id');

    this.TeamsService.getTeam(id).then((res:TeamModel) => {
      this.team = res;
    });

    this.LeaguesService.getLeagues().then((res:LeagueModel[]) => {
      this.leagues = res;
    });

    this.ClubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();
    
  }

  ngOnInit(): void {
  
  }

  createForm(){

    this.formulario = this.fb.group({
      club: ['', [Validators.required] ],
      league: ['', [Validators.required] ],
      season: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)] ],
      coach: ['', ]
    });

  }

  setLeague(){

  }

  get clubNoValid(){
    return this.formulario.get('club').invalid && this.formulario.get('club').touched;
  }

  get leagueNoValid(){
    return this.formulario.get('league').invalid && this.formulario.get('league').touched;
  }

  get seasonNoValid(){
    return this.formulario.get('season').invalid && this.formulario.get('season').touched;
  }

  get coachNoValid(){
    return this.formulario.get('coach').invalid && this.formulario.get('coach').touched;
  }

  isSelectedLeague(league_name){


    if(league_name.localeCompare(this.team.league.league_name) == 0){
      return true;
    }
    else{
      return false;
    }

  }


  guardar(){


    if(this.formulario.invalid){

      return Object.values(this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });

    }
    else{
      
      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        icon: 'info',
        allowOutsideClick: false
      });

      Swal.showLoading();

      this.TeamsService.updateTeam(this.team).then( resp => {
        //If the put success
        
        Swal.fire({
          title: 'Equipo editado correctamente.',
          icon: 'success'
        });

      })
      //If the update fails:
      .catch( (err: HttpErrorResponse) => {
        console.error('Ann error occurred: ', err.error);
        console.log(err);
        Swal.fire({
          title: 'Error al editar el equipo.',
          icon: 'error'
        });
      });

    }

  }

}
