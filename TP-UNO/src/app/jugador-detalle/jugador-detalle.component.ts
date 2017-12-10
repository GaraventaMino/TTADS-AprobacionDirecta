import { Component, OnInit } from '@angular/core';
import { JugadoresService } from "../services/jugadores.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jugador-detalle',
  templateUrl: './jugador-detalle.component.html',
  styleUrls: ['./jugador-detalle.component.css']
})
export class JugadorDetalleComponent implements OnInit {
  jugador: any = {
    nombre: '',
    edad: '',
    goles: '',
    amarillas: '',
    rojas: '',
    equipo: ''
  }

  constructor(
    private jugadoresService: JugadoresService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jugadoresService.getJugador(params['id'])
      .subscribe(
          jugador => this.jugador = jugador, //Bind to view
           err => {
               // Log errors if any
               console.log(err);
           });
    });
  }
}
