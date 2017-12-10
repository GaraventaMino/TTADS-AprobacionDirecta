import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { JugadoresService } from '../services/jugadores.service';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})
export class JugadoresComponent implements OnInit {
  jugadores: any = [{
    nombre: '',
    edad: '',
    goles: '',
    amarillas: '',
    rojas: '',
    equipo: ''
  }]

  constructor(
    private jugadoresService: JugadoresService,
  ) { }

  ngOnInit() {
    this.loadJugadores()
  }

  loadJugadores() {
    this.jugadoresService.getAllJugadores()
                          .subscribe(
                            jugadores => this.jugadores = jugadores,
                            err => console.log(err)
                          );
  }

}
