import { Component } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  items: any;
  private apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=b57c97dcd5c10ae95c73f12d1b5c3373&language=en-US&query={searchterm}&page=1&include_adult=true';
  
  constructor(private http:Http) { }

  onSearchChange(searchValue:string){
    if(searchValue==""){
      this.items=null;        //vacia la lista si no busca nada
    }else{
      this.getPelis(searchValue).subscribe(items => this.items =items.results,      //el .results es por como trae todo el json en ese obj, 
        err => {console.log(err);});             

    }
     
  }
  onBlur(){
    setTimeout(()=>{   //Tiene timeout para que primero haga el routing al detalle, sino se vacian los items antes
      this.items = null;
    },300);
  }

  

  getPelis(term:string) : Observable<any> {
            return this.http.get(this.apiUrl.replace('{searchterm}',term))
                            .map((res:Response) => res.json()) 
                            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        }      
  

}
