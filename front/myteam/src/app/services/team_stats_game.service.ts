import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team_stats_gameModel } from '../models/team_stats_game.model';

@Injectable()
export class Player_stats_teamsService{

    private team_stats_gameUrl = 'http://localhost:8000/api/v1/team_stats_game';

    constructor(private http: HttpClient){
        //console.log("Player_stats_teams service ready");
    }

    //Player_stats_teams collection

    getPlayer_stats_teams(search = ""){
        return this.http.get(this.team_stats_gameUrl+search).toPromise();
    }

    deletePlayer_stats_teams(){
        return this.http.delete(this.team_stats_gameUrl, {responseType: 'text'}).toPromise();
    }

    //Single team_stats_game

    createTeam_stats_team(team_stats_game:Team_stats_gameModel){
        return this.http.post(this.team_stats_gameUrl, team_stats_game, {responseType: 'text'}).toPromise();
    }

    getTeam_stats_team(team_stats_game_id:string){
        return this.http.get(this.team_stats_gameUrl+"/"+team_stats_game_id).toPromise();
    }

    updateTeam_stats_team(team_stats_game:Team_stats_gameModel){

        const team_stats_gameTemp = {
            ...team_stats_game
        };

        delete team_stats_gameTemp._id;

        return this.http.put(this.team_stats_gameUrl+"/"+team_stats_game._id, team_stats_gameTemp, {responseType: 'text'}).toPromise();
    }

    deleteTeam_stats_team(team_stats_game_id:string){
        return this.http.delete(this.team_stats_gameUrl+"/"+team_stats_game_id, {responseType: 'text'}).toPromise();
    }

}