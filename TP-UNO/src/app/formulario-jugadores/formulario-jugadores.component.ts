import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { EquiposService } from "../services/equipos.service";
import { JugadoresService } from "../services/jugadores.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-formulario-jugadores',
  templateUrl: './formulario-jugadores.component.html',
  styleUrls: ['./formulario-jugadores.component.css']
})
export class FormularioJugadoresComponent implements OnInit {
  equipos: any;
  jugador: any = {
    nombre: '',
    equipo: '',
    imagen: ''
  }

  constructor(
    private equiposService: EquiposService,
    private jugadoresService: JugadoresService) { }

  altaJugador() {
    if(this.jugador.nombre == "" && this.jugador.equipo == ""){
    }
    else {
      this.jugadoresService.addJugador(this.jugador)
                            .subscribe(
                                data => console.log("EXITO"),
                                error => console.log(error)
                              )
    }
  }

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
