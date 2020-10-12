import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

//Services
import { LeaguesService } from '../../../../services/leagues.service';
import { ClubsService } from '../../../../services/clubs.service';
import { PlayersService } from '../../../../services/players.service';
import { TeamsService } from '../../../../services/teams.service';

//Models
import { LeagueModel } from '../../../../models/league.model';
import { ClubModel } from 'src/app/models/club.model';
import { PlayerModel } from 'src/app/models/player.model';
import { TeamModel } from 'src/app/models/team.model';


@Component({
  selector: 'app-newplayer-form',
  templateUrl: './newplayer-form.component.html',
  styleUrls: ['./newplayer-form.component.css']
})
export class NewplayerFormComponent implements OnInit {

  formulario:FormGroup;
  clubs: ClubModel[];
  teams:TeamModel[];
  player:PlayerModel = new PlayerModel();

  club_selected:boolean = false;

  constructor( private fb:FormBuilder, private leaguesService:LeaguesService, private clubsService:ClubsService, private teamsService:TeamsService, private playersService:PlayersService ) { 

    this.clubsService.getClubs().then((res:ClubModel[]) => {
      this.clubs = res;
    });

    this.createForm();

  }

  ngOnInit(): void {
  }

  createForm(){

    this.formulario = this.fb.group({
      name: ['', [Validators.required] ],
      last_name: ['', [Validators.required] ],
      email: ['', [Validators.email] ],
      birth_date: ['', [Validators.required]],
      primary_position: ['', [Validators.required] ],
      secondary_position: ['', ],
      phone: [''],
      weight: [''],
      height: [''],
      number: ['', Validators.required],
      league: ['', [Validators.required]],
      club: ['', [Validators.required]],
    });

  }

  get nameNoValid(){
    return this.formulario.get('name').invalid && this.formulario.get('name').touched;
  }

  get emailNoValid(){
    return this.formulario.get('email').invalid && this.formulario.get('email').touched;
  }

  get lastnameNoValid(){
    return this.formulario.get('last_name').invalid && this.formulario.get('last_name').touched;
  }

  get birthdateNoValid(){
    return this.formulario.get('birth_date').invalid && this.formulario.get('birth_date').touched;
  }

  get primarypositionNoValid(){
    return this.formulario.get('primary_position').invalid && this.formulario.get('primary_position').touched;
  }

  get secondarypositionNoValid(){
    return this.formulario.get('secondary_position').invalid && this.formulario.get('secondary_position').touched;
  }

  get phoneNoValid(){
    return this.formulario.get('phone').invalid && this.formulario.get('phone').touched;
  }

  get clubNoValid(){
    return this.formulario.get('club').invalid && this.formulario.get('club').touched;
  }

  get leagueNoValid(){
    return this.formulario.get('league').invalid && this.formulario.get('league').touched;
  }

  get numberNoValid(){
    return this.formulario.get('number').invalid && this.formulario.get('number').touched;
  }

  selectClub(club_index){

    this.teamsService.getTeam("?club.club_id="+this.clubs[club_index]._id).then((res:TeamModel[]) => {
      this.teams = res;
    });

    let newClubInfo = {
      club_id: this.clubs[club_index]._id,
      club_name: this.clubs[club_index].name,
      club_img: this.clubs[club_index].img
    };

    this.player.teams[0] = newClubInfo;

    console.log("PLAYER TEAMS: "+JSON.stringify(this.player.teams));


    this.club_selected = true;

  }

  setLeague(team_index){ //CAMBIAR

  }

  guardar(){
    
    console.log("PLAYER: "+JSON.stringify(this.player));

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

      this.playersService.createPlayer(this.player).then(resp => {
        //If the post success

        Swal.fire({
          title: 'Jugador creado correctamente.',
          icon: 'success'
        });

      })
      //If the post fails:
      .catch( (err: HttpErrorResponse) => {
        console.error('Ann error occurred: ', err.error);
        Swal.fire({
          title: 'Error al crear el jugador.',
          text: 'Compruebe que no existe un jugador con el mismo nombre y fecha de nacimiento.',
          icon: 'error'
        });
      });

    }

  }

}
