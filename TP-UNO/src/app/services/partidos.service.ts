import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PartidosService {

    
    // Resolve HTTP using the constructor
    constructor (private http: Http) {}

    urlPartidos: string = 'http://localhost:3000/api/partidos';
    urlPartidosActivos: string = 'http://localhost:3000/api/partidos/activos';
    urlPartidosPlanif: string = 'http://localhost:3000/api/partidos/planificados';
    urlPartidosTorneo: string = 'http://localhost:3000/api/partidos/torneo/{id}';
    urlPartidoById: string = 'http://localhost:3000/api/partidos/{id}';
    
    
    addPartido(partido: Object) :Observable<any> {
        let body = JSON.stringify(partido);
        let headers = new Headers({ 'Content-Type' : 'application/json' });
        let options = new RequestOptions({ headers: headers});

        return this.http.post(this.urlPartidos, partido, options)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllPartidos() : Observable<any> {
        return this.http.get(this.urlPartidos)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllPartidosActivos() : Observable<any> {
        return this.http.get(this.urlPartidosActivos)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    getAllPartidosPlanificados() : Observable<any> {
        return this.http.get(this.urlPartidosPlanif)
                            .map((res:Response) => res.json())
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAllPartidosByTorneo(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlPartidos.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getPartido(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.urlPartidoById.replace('{id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}