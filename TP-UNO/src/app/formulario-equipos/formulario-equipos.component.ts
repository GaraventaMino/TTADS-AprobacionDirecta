import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { EquiposService } from "../services/equipos.service";
import { TorneosService } from "../services/torneos.service";
import { EstadiosService } from "../services/estadios.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-formulario-equipos',
  templateUrl: './formulario-equipos.component.html',
  styleUrls: ['./formulario-equipos.component.css']
})
export class FormularioEquiposComponent implements OnInit {
  torneos: any;
  estadios: any;
  equipo: any = {
    nombre: '',
    tecnico: '',
    escudo: '',
    torneos: [],
    estadios: []
  }

  constructor(
    private equiposService: EquiposService,
    private torneosService: TorneosService,
    private estadiosService: EstadiosService
  ) { }

  ngOnInit() {
    this.loadTorneos();
    this.loadEstadios();
  }

  altaEquipo() {
    if(this.equipo.nombre == "" && this.equipo.torneos == "" && this.equipo.estadios == ""){
    }
    else {
      this.equiposService.addEquipo(this.equipo)
                            .subscribe(
                                data => console.log("EXITO"),
                                error => console.log(error)
                              )
    }
  }

  loadTorneos() {
    this.torneosService.getAllTorneos()
    .subscribe(
      torneos => this.torneos = torneos,
      err => console.log(err)
    );
  }

  loadEstadios() {
    this.estadiosService.getAllEstadios()
    .subscribe(
      estadios => this.estadios = estadios,
      err => console.log(err)
    );
  }

}
