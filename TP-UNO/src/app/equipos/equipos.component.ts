import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { EquiposService } from '../services/equipos.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  equipos: any = [{
    nombre: '',
    escudo: '',
    torneos: [],
    estadios: [],
    tecnico: '',
    partidos_jugados: ''
  }]

  constructor(
    private equiposService: EquiposService
  ) { }

  ngOnInit() {
    this.loadEquipos()
  }

  loadEquipos() {
    this.equiposService.getAllEquipos()
                          .subscribe(
                            equipos => this.equipos = equipos,
                            err => console.log(err)
                          );
  }

}