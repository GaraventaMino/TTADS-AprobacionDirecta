import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ArbitrosService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlArbitros: string = 'http://localhost:3000/api/arbitros';
    
    
    addArbitro(arbitro: Object) :Observable<any> {
        let body = JSON.stringify(arbitro);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlArbitros, arbitro, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllArbitros() : Observable<any> {
        return this.http.get(this.urlArbitros)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}