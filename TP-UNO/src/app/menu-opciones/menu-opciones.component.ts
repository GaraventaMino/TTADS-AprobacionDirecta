import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-opciones',
  templateUrl: './menu-opciones.component.html',
  styleUrls: ['./menu-opciones.component.css']
})
export class MenuOpcionesComponent implements OnInit {

  @Output() filtrar = new EventEmitter();
  selectedGenre: string;
  selectedYear: string;
  selectedOrder: string;
  selectedAdult: string;

  clicked($event){
  $event.target.blur();
  this.filtrar.emit({year: this.selectedYear,orderby: this.selectedOrder, genre: this.selectedGenre,adult: this.selectedAdult });
  }
    
  genres = [
    {
      idGenre: '28',
      descGenre: 'Action'
    },
    {
      idGenre: '12',
      descGenre: 'Adventure'
    },
    {
      idGenre: '16',
      descGenre: 'Animation'
    },
    {
      idGenre: '35',
      descGenre: 'Comedy'
    },
    {
      idGenre: '80',
      descGenre: 'Crime'
    },
    {
      idGenre: '99',
      descGenre: 'Documentary'
    },
    {
      idGenre: '18',
      descGenre: 'Drama'
    },
    {
      idGenre: '10751',
      descGenre: 'Family'
    },
    {
      idGenre: '14',
      descGenre: 'Fantasy'
    },
    {
      idGenre: '36',
      descGenre: 'History'
    },
    {
      idGenre: '27',
      descGenre: 'Horror'
    },
    {
      idGenre: '10402',
      descGenre: 'Music'
    },
    {
      idGenre: '9648',
      descGenre: 'Mystery'
    },
    {
      idGenre: '10749',
      descGenre: 'Romance'
    },
    {
      idGenre: '878',
      descGenre: 'Science Fiction'
    },
    {
      idGenre: '10770',
      descGenre: 'TV Movie'
    },
    {
      idGenre: '53',
      descGenre: 'Thriller'
    },
    {
      idGenre: '10752',
      descGenre: 'War'
    },
    {
      idGenre: '37',
      descGenre: 'Western'
    }
  ];

    
    years = [
      {idyear: '2017'},
      {idyear: '2016'},
      {idyear: '2015'},
      {idyear: '2014'},
      {idyear: '2013'},
      {idyear: '2012'},
      {idyear: '2011'},
      {idyear: '2010'},
      {idyear: '2009'},
      {idyear: '2008'},
      {idyear: '2007'},
      {idyear: '2006'},
      {idyear: '2005'},
      {idyear: '2004'},
      {idyear: '2003'},
      {idyear: '2002'},
      {idyear: '2001'},
      {idyear: '2000'},
      {idyear: '1999'},
      {idyear: '1998'},
      {idyear: '1997'},
      {idyear: '1996'},
      {idyear: '1995'},
      {idyear: '1994'},
      {idyear: '1993'},
      {idyear: '1992'},
      {idyear: '1991'},
      {idyear: '1990'},
      {idyear: '1989'},
      {idyear: '1988'},
      {idyear: '1987'},
      {idyear: '1986'},
      {idyear: '1985'}
    ];
    
    orderBys = [
      {idOrder: 'original_title.desc', descOrder:'Título'},
      {idOrder: 'popularity.desc', descOrder:'Popularidad'},
      {idOrder: 'release_date.desc', descOrder:'Fecha de estreno'},
      {idOrder: 'vote_average.desc', descOrder:'Puntuación'}
      
    ];

  constructor() { }

  ngOnInit() {
  }

}
