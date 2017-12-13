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
    urlJugador: string = 'http://localhost:3000/api/jugadores/{id}';
    
    
    addJugador(jugador: Object) :Observable<any> {
        let body = JSON.stringify(jugador);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlJugadores, jugador, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => console.log(error) || 'Server error');
    }

    getAllJugadores() : Observable<any> {
        return this.http.get(this.urlJugadores)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    
    getJugador(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlJugador.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    deleteJugador(id: any) : Observable<any> {
        // ...using get request
        return this.http.delete(this.urlJugador.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    editJugador(id: any, jugador: Object) :Observable<any> {
        let body = JSON.stringify(jugador);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.put(this.urlJugador.replace('{id}', id), jugador, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}