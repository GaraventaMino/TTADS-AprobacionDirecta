import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EstadiosService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlEstadios: string = 'http://localhost:3000/api/estadios';
    
    
    addEstadio(estadio: Object) :Observable<any> {
        let body = JSON.stringify(estadio);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlEstadios, estadio, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllEstadios() : Observable<any> {
        return this.http.get(this.urlEstadios)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}