import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { TorneosService } from "../services/torneos.service";
import {Observable} from 'rxjs/Rx';


@Component({
  selector: 'app-formulario-torneos',
  templateUrl: './formulario-torneos.component.html',
  styleUrls: ['./formulario-torneos.component.css']
})
export class FormularioTorneosComponent implements OnInit {
  torneo: any = {
    nombre: '',
    logo: '',
    imagen_trofeo: ''
  }

  constructor(private torneosService: TorneosService) {
   }

  altaTorneo() {
    if(this.torneo.nombre == ""){
    }
    else {
      this.torneosService.addTorneo(this.torneo)
                            .subscribe(
                                data => console.log("EXITO"),
                                error => console.log(error)
                              );
                              alert("Torneo creado con exito !")
    }
  }
  ngOnInit() {
  }

}
