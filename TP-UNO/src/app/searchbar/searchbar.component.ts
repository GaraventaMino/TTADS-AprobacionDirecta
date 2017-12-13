import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { TorneosService } from "../services/torneos.service";

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  items: any;
  torneos: any = [{
    nombre: '',
    logo: '',
    imagen_trofeo: ''
  }]

  constructor(
    private torneosService: TorneosService,
    private http:Http) { }

  onSearchChange(searchValue:string){
    if(searchValue==""){
      this.items=null;        //vacia la lista si no busca nada
    }else{
      for(let torneo of this.torneos){
        if(torneo.nombre.indexOf(searchValue)){
          this.items.push(torneo);
        }           
        console.log(searchValue, torneo.nombre)
      }
    }
     
  }
  
  onBlur(){
    setTimeout(()=>{   //Tiene timeout para que primero haga el routing al detalle, sino se vacian los items antes
      this.items = null;
    },300);
  }

  loadTorneos() {
    this.torneosService.getAllTorneos()
                          .subscribe(
                            torneos => this.torneos = torneos,
                            err => console.log(err)
                          );
  }

  ngOnInit() {
    this.loadTorneos()
  }


}
