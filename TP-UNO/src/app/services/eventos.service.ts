import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EventosService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlEventos: string = 'http://localhost:3000/api/eventos';
    urlTipoEventos: string = 'http://localhost:3000/api/tipo_eventos';
    
    
    addEvento(evento: Object) :Observable<any> {
        let body = JSON.stringify(evento);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlEventos, evento, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllTipoEvento() : Observable<any> {
        return this.http.get(this.urlTipoEventos)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}