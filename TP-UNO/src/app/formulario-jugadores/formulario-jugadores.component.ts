import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { EquiposService } from "../services/equipos.service";
import { JugadoresService } from "../services/jugadores.service";
import {Observable} from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

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
    imagen: '',
    edad: ''
  };
  modificacion: boolean;

  constructor(
    private route: ActivatedRoute,
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
                              );
                              alert("Jugador creado con exito !")
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.modificacion = true;
        this.loadJugador(params.id);
      }
      else {
        this.modificacion = false;
      }
    });
    this.loadEquipos()
  }

  
  loadJugador(id: any) {
    this.jugadoresService.getJugador(id)
    .subscribe(
      jugador => this.jugador = jugador,
      err => console.log(err)
    )
  }

  
  editarJugador(id: any){
    if(this.jugador.equipo._id) {
      this.jugador.equipo = this.jugador.equipo._id;
    }
    delete this.jugador._id;
    console.log(this.jugador);
    this.jugadoresService.editJugador(id, this.jugador)
    .subscribe(
        data => console.log("EXITO"),
        error => console.log(error)
      );
      alert("Equipo modificado correctamente !");
  }

  loadEquipos() {
    this.equiposService.getAllEquipos()
                          .subscribe(
                            equipos => this.equipos = equipos,
                            err => console.log(err)
                          );
  }

}
