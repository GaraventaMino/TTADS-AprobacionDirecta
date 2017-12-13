import { Component, OnInit } from '@angular/core';
import { MdInput,MdList } from "@angular/material";
import { TorneosService } from "../services/torneos.service";
import {Observable} from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-formulario-torneos',
  templateUrl: './formulario-torneos.component.html',
  styleUrls: ['./formulario-torneos.component.css']
})
export class FormularioTorneosComponent implements OnInit {
  torneo: any = {
    nombre: '',
    logo: '',
    imagen_trofeo: ''
  }
  modificacion: boolean;

  constructor(
    private route: ActivatedRoute,
    private torneosService: TorneosService) {
   }

  altaTorneo() {
    if(this.torneo.nombre == ""){
    }
    else {
      this.torneosService.addTorneo(this.torneo)
                            .subscribe(
                                data => console.log("EXITO"),
                                error => console.log(error)
                              );
                              alert("Torneo creado con exito !")
    }
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.modificacion = true;
        this.loadTorneo(params.id);
      }
      else {
        this.modificacion = false;
      }
    });
  }

  loadTorneo(id: any) {
    this.torneosService.getTorneo(id)
    .subscribe(
      torneo => this.torneo = torneo,
      err => console.log(err)
    )
  }

  editarTorneo(id: any){
    delete this.torneo.equipos;
    delete this.torneo.partidos;
    delete this.torneo._id;
    console.log(this.torneo);
    this.torneosService.editTorneo(id, this.torneo)
    .subscribe(
        data => console.log("EXITO"),
        error => console.log(error)
      );
      alert("Equipo modificado correctamente !");
  }

}
