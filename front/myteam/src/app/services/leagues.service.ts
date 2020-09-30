import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LeaguesService{

    private leagues:any[] = [];
    private leaguesUrl = 'http://localhost:8000/api/v1/leagues'

    constructor(private http: HttpClient){
        console.log("Servicio listo");
    }

    getLeagues(){
        this.http.get(this.leaguesUrl).subscribe( (resp:any) => {
            console.log(resp);
        });
    }

}