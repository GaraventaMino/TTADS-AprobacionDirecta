import { Component, OnInit } from '@angular/core';
import { TorneosService } from "../services/torneos.service";
import {Observable} from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { EquiposService } from "../services/equipos.service";
import { PartidosService } from "../services/partidos.service";
import { EstadiosService } from "../services/estadios.service";

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
  partidos: any = [];
  estadios: any = [];
  posiciones: any = [];
  amonestados: any = [];
  expulsados: any = [];
  goleadores: any = [];
  torneos: any;

  constructor(
    private route: ActivatedRoute,
    private torneoService: TorneosService,
    private equiposService: EquiposService,
    private partidosService: PartidosService,
    private estadiosService: EstadiosService
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
    setTimeout(()=>{   //Tiene timeout para que primero haga el routing al detalle, sino se vacian los items antes
      for(let part of this.torneo.partidos) {
        this.partidosService.getPartido(part)
        .subscribe(
          partido => this.partidos.push(partido),
          err => console.log(err)
        );
      }
    },300);
 //   this.route.params.subscribe(params => {
  //    this.torneoService.getTablaPosiciones(params['id'])
  //    .subscribe(
  //        posiciones => this.posiciones = posiciones, //Bind to view
  //         err => {
               // Log errors if any
   //            console.log(err);
  //         });
 //   });

   // this.route.params.subscribe(params => {
     // this.torneoService.getTablaGoleadores(params['id'])
    //  .subscribe(
    //      goleadores => this.goleadores = goleadores, //Bind to view
   //        err => {
    //           // Log errors if any
     //          console.log(err);
    //       });
   // });

   // this.route.params.subscribe(params => {
     // this.torneoService.getTablaAmonestados(params['id'])
    //  .subscribe(
     //     amonestados => this.amonestados = amonestados, //Bind to view
    //       err => {
   //            // Log errors if any
  //             console.log(err);
  //         });
//    });

 //   this.route.params.subscribe(params => {
  //    this.torneoService.getTablaExpulsados(params['id'])
   //   .subscribe(
    //      expulsados => this.expulsados = expulsados, //Bind to view
     //      err => {
               // Log errors if any
     //          console.log(err);
      //     });
    //});
  }

  eliminarTorneo(id: any) {
    this.torneoService.deleteTorneo(id)
    .subscribe(
      data => alert(data),
      err => alert(err)
    );
  }
  }

