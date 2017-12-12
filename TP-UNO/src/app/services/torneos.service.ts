import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TorneosService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlTorneos: string = 'http://localhost:3000/api/torneos';
    urlTorneoById: string = 'http://localhost:3000/api/torneos/{id}';
    urlTablaPosicionesTorneo: string = 'http://localhost:3000/api/torneos/{id}/posiciones'
    urlTablaGoleadoresTorneo: string = 'http://localhost:3000/api/torneos/{id}/goleadores'
    urlTablaAmonestadosTorneo: string = 'http://localhost:3000/api/torneos/{id}/amonestados'
    urlTablaExpulsadosTorneo: string = 'http://localhost:3000/api/torneos/{id}/expulsados'
    
    
    addTorneo(torneo: Object) :Observable<any> {
        let body = JSON.stringify(torneo);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlTorneos, torneo, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllTorneos() : Observable<any> {
        return this.http.get(this.urlTorneos)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTorneo(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlTorneoById.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTablaPosiciones(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlTablaPosicionesTorneo.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTablaGoleadores(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlTablaGoleadoresTorneo.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTablaAmonestados(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlTablaAmonestadosTorneo.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTablaExpulsados(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlTablaExpulsadosTorneo.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }  
}