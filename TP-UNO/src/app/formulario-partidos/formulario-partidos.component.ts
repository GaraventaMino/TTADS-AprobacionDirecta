import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { EquiposService } from "../services/equipos.service";
import { ArbitrosService } from "../services/arbitros.service";
import { EstadiosService } from "../services/estadios.service";
import { PartidosService } from "../services/partidos.service";
import { TorneosService } from "../services/torneos.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-formulario-partidos',
  templateUrl: './formulario-partidos.component.html',
  styleUrls: ['./formulario-partidos.component.css']
})
export class FormularioPartidosComponent implements OnInit {
  estadios: any;
  torneos: any;
  equipos: any;
  arbitros: any;
  seleccionado: boolean;
  partido: any = {
    fecha_hora: '',
    equipo_local: '',
    equipo_visitante: '',
    estadio: '',
    torneo: null,
    arbitro: ''
  }
  torneo: any = {
    equipos: []
  };

  constructor(
    private equiposService: EquiposService,
    private arbitrosService: ArbitrosService,
    private estadiosService: EstadiosService,
    private partidosService: PartidosService,
    private torneoService: TorneosService
  ) { }

  ngOnInit() {
    this.seleccionado = false;
    this.loadArbitros();
    this.loadEstadios();
    this.loadTorneos();
  }

  altaPartido() {
    if(this.partido.fecha_hora == "" && this.partido.equipo_local == "" && this.partido.equipo_visitante == ""){
    }
    else {
      this.partidosService.addPartido(this.partido)
                            .subscribe(
                                data => alert(data),
                                error => alert(error)
                              );
    }
  }

  loadArbitros() {
    this.arbitrosService.getAllArbitros()
    .subscribe(
      arbitros => this.arbitros = arbitros,
      err => console.log(err)
    );
  }

  loadTorneos() {
    this.torneoService.getAllTorneos()
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

  loadEquipos() {
    this.torneoService.getTorneo(this.partido.torneo)
    .subscribe(
      torneo => this.torneo = torneo,
      err => console.log(err)
    );
  }

  clicked() {
    this.seleccionado = true;
    this.loadEquipos(); 
  }

}