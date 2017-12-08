/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PeliculasService {

     // Resolve HTTP using the constructor
     constructor (private http: Http) {}

     // private instance variable to hold base url
     private peliculasUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=b57c97dcd5c10ae95c73f12d1b5c3373&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=';
     private peliculaUrl = 'https://api.themoviedb.org/3/movie/{movie_id}?api_key=b57c97dcd5c10ae95c73f12d1b5c3373&language=en-US';
     private creditsUrl = 'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=b57c97dcd5c10ae95c73f12d1b5c3373';
     private ratingUrl = 'https://api.themoviedb.org/3/movie/{movie_id}/rating?api_key=b57c97dcd5c10ae95c73f12d1b5c3373&guest_session_id={id_session}';
     private sessionUrl = 'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=b57c97dcd5c10ae95c73f12d1b5c3373';
     private reviewsUrl = ' https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key=b57c97dcd5c10ae95c73f12d1b5c3373&language=en-US&page=1';
     
     // Fetch all existing movies
     getFiltradas(page,url) : Observable<any> {
         
        // ...using get request
        return this.http.get(url+page)
                       // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }  
     getPelis(page) : Observable<any> {
               // ...using get request
               return this.http.get(this.peliculasUrl+page)
                              // ...and calling .json() on the response to return data
                               .map((res:Response) => res.json()) 
                               //...errors if any
                               .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
           }   
    getPeli(id: any) : Observable<any> {
    // ...using get request
    return this.http.get(this.peliculaUrl.replace('{movie_id}', id))
                    // ...and calling .json() on the response to return data
                    .map((res:Response) => res.json()) 
                    //...errors if any
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getCredits(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.creditsUrl.replace('{movie_id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getSession() : Observable<any> {
        // ...using get request
        return this.http.get(this.sessionUrl)
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    
    rateMovie (id: any, body: any, idSession): Observable<Comment[]> {
        let bodyString = {
            "value": body
          }; // Stringify payload
        let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options       = new RequestOptions({ headers: headers }); // Create a request option
        let url = this.ratingUrl.replace('{movie_id}', id);
        return this.http.post(url.replace('{id_session}', idSession), bodyString, options) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    } 

    getReviews(id: any) : Observable<any> {
        // ...using get request
        return this.http.get(this.reviewsUrl.replace('{movie_id}', id))
                        // ...and calling .json() on the response to return data
                        .map((res:Response) => res.json()) 
                        //...errors if any
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }


}