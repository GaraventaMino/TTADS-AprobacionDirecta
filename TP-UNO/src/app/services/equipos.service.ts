import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EquiposService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlEquipos: string = 'http://localhost:3000/api/equipos';
    urlEquiposTorneo: string = 'http://localhost:3000/api/equipos/torneo/{id}';
    
    
    addEquipo(equipo: Object) :Observable<any> {
        let body = JSON.stringify(equipo);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlEquipos, equipo, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllEquipos() : Observable<any> {
        return this.http.get(this.urlEquipos)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllEquiposByTorneo(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlEquiposTorneo.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}