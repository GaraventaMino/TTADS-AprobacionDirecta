import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JugadoresService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlJugadores: string = 'http://localhost:3000/api/jugadores';
    
    
    addJugador(jugador: Object) :Observable<any> {
        let body = JSON.stringify(jugador);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlJugadores, jugador, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllJugadores() : Observable<any> {
        return this.http.get(this.urlJugadores)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}