import { Component, OnInit } from '@angular/core';
import { TorneosService } from "../services/torneos.service";
import {Observable} from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { EquiposService } from "../services/equipos.service";
import { PartidosService } from "../services/partidos.service";

@Component({
  selector: 'app-torneo-detalle',
  templateUrl: './torneo-detalle.component.html',
  styleUrls: ['./torneo-detalle.component.css']
})
export class TorneoDetalleComponent implements OnInit {
  torneo: any = {
    nombre: '',
    partidos: [],
    equipos: [],
    logo: '',
    imagen_trofeo: ''
  }
  equipos: any;
  partidos: any;
  posiciones: any;
  amonestados: any;
  expulsados: any;
  goleadores: any;

  constructor(
    private route: ActivatedRoute,
    private torneoService: TorneosService,
    private equiposService: EquiposService,
    private partidosService: PartidosService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.torneoService.getTorneo(params['id'])
      .subscribe(
          torneo => this.torneo = torneo, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });

    this.route.params.subscribe(params => {
      this.torneoService.getTablaPosiciones(params['id'])
      .subscribe(
          posiciones => this.posiciones = posiciones, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });

    this.route.params.subscribe(params => {
      this.torneoService.getTablaGoleadores(params['id'])
      .subscribe(
          goleadores => this.goleadores = goleadores, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });

    this.route.params.subscribe(params => {
      this.torneoService.getTablaAmonestados(params['id'])
      .subscribe(
          amonestados => this.amonestados = amonestados, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });

    this.route.params.subscribe(params => {
      this.torneoService.getTablaExpulsados(params['id'])
      .subscribe(
          expulsados => this.expulsados = expulsados, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });
  }

}
