import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { EquiposService } from "../services/equipos.service";
import { TorneosService } from "../services/torneos.service";
import { EstadiosService } from "../services/estadios.service";
import {Observable} from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

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
    torneo: '',
    estadio: ''
  };
  modificacion: boolean;

  constructor(
    private route: ActivatedRoute,
    private equiposService: EquiposService,
    private torneosService: TorneosService,
    private estadiosService: EstadiosService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.modificacion = true;
        this.loadEquipo(params.id);
      }
      else {
        this.modificacion = false;
      }
    });
    this.loadTorneos();
    this.loadEstadios();
  }

  loadEquipo(id: any) {
    this.equiposService.getEquipo(id)
    .subscribe(
      equipo => this.equipo = equipo,
      err => console.log(err)
    )
  }

  editarEquipo(id: any){
    if(this.equipo.torneo._id) {
      this.equipo.torneo = this.equipo.torneo._id;
    }
    if(this.equipo.estadio._id) {
      this.equipo.estadio = this.equipo.estadio._id;
    }
    delete this.equipo.jugadores;
    delete this.equipo._id;
    this.equiposService.editEquipo(id, this.equipo)
    .subscribe(
        data => console.log("EXITO"),
        error => console.log(error)
      );
      alert("Equipo modificado correctamente !");
  }


  altaEquipo() {
    if(this.equipo.nombre == "" && this.equipo.torneos == "" && this.equipo.estadios == ""){
    }
    else {
      this.equiposService.addEquipo(this.equipo)
                            .subscribe(
                                data => console.log("EXITO"),
                                error => console.log(error)
                              );
                              alert("Equipo creado correctamente !");
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
