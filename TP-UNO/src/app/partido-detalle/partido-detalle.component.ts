import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PartidosService } from "../services/partidos.service";
import { EventosService } from "../services/eventos.service";

@Component({
  selector: 'app-partido-detalle',
  templateUrl: './partido-detalle.component.html',
  styleUrls: ['./partido-detalle.component.css']
})
export class PartidoDetalleComponent implements OnInit {
  partido: any;
  evento_visitante: any = {
    tiempo_ocurrencia: '',
    tipo_evento: '',
    partido: '',
    jugador: '',
    equipo: ''
  }
  evento_local: any = {
    tiempo_ocurrencia: '',
    tipo_evento: '',
    partido: '',
    jugador: '',
    equipo: ''
  }
  tipo_evento: any = [{
    _id: '',
    nombre: '',
    icono: ''
  }]

  constructor(
    private route: ActivatedRoute,
    private partidosService: PartidosService,
    private eventosService: EventosService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.partidosService.getPartido(params['id'])
      .subscribe(
        partido => this.partido = partido,
        err => console.log(err)
      );
    });
    this.loadTipoEventos();
  }

  loadTipoEventos(){
    this.eventosService.getAllTipoEvento()
    .subscribe(
      tipo_evento => this.tipo_evento = tipo_evento,
      err => console.log(err)
    );
  }

  eventoLocal(){
    this.evento_local.equipo = this.partido.equipo_local._id;
    this.evento_local.partido = this.partido._id;
    this.eventosService.addEvento(this.evento_local)
    .subscribe(
      data => console.log("Exito"),
      err => console.log(err)
    );
    window.location.reload();
  }

  eventoVisitante(){
    this.evento_visitante.equipo = this.partido.equipo_visitante._id;
    this.evento_visitante.partido = this.partido._id;
    this.eventosService.addEvento(this.evento_visitante)
    .subscribe(
      data => console.log("Exito"),
      err => console.log(err)
    );
    window.location.reload();
  }
}
