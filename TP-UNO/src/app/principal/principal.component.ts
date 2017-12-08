import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  filtro: string ;

  constructor() { }

  filterChanged($event){
    let order: string;

    if($event.orderby==undefined){    //Por defecto ordena por popularidad
      order = 'popularity.desc';
    }else{
      order = $event.orderby;
    }

    this.filtro='https://api.themoviedb.org/3/discover/movie?api_key=b57c97dcd5c10ae95c73f12d1b5c3373&language=en-US'
    +'&sort_by='+order
    +'&include_adult='+$event.adult
    +'&primary_release_year='+$event.year;
    if($event.genre!=undefined){
      this.filtro+='&with_genres='+$event.genre;
    }
    this.filtro+='&include_video=false'
    +'&page=';
  }
  ngOnInit() {
  }

  
}
