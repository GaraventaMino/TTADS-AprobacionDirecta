import { Component, OnInit } from '@angular/core';
import { PartidosService } from "../services/partidos.service";

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent implements OnInit {
  partidos: any;

  constructor(
    private partidosService: PartidosService,
  ) { }

  ngOnInit() {
    this.loadPartidos();
  }

  loadPartidos() {
    this.partidosService.getAllPartidosPlanificados()
    .subscribe(
      partidos => this.partidos = partidos,
      err => console.log(err)
    );
  }

}
