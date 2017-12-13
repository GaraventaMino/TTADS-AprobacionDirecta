import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { EquiposService } from "../services/equipos.service";
import { JugadoresService } from "../services/jugadores.service";
import { TorneosService } from "../services/torneos.service";

@Component({
  selector: 'app-equipo-detalle',
  templateUrl: './equipo-detalle.component.html',
  styleUrls: ['./equipo-detalle.component.css']
})
export class EquipoDetalleComponent implements OnInit {
equipo: any = {
  nombre: '',
  tecnico: '',
  escudo: '',
  puntaje: '',
  partidos_jugados: '',
  torneos: [],
  estadios: [],
  jugadores: []

};
jugadores: any;
estadios: any;
torneos: any;
  constructor(
    private route: ActivatedRoute,
    private equiposService: EquiposService,
    private torneoService: TorneosService,
    private jugadoresService: JugadoresService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.equiposService.getEquipo(params['id'])
      .subscribe(
          equipo => this.equipo = equipo, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });
  }

  eliminarEquipo(id: any) {
    this.equiposService.deleteEquipo(id)
    .subscribe(
        data => alert(data),
        error => alert(error)
      );
  }
}