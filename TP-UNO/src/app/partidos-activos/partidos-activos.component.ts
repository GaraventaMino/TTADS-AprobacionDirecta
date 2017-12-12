import { Component, OnInit } from '@angular/core';
import { PartidosService } from "../services/partidos.service";

@Component({
  selector: 'app-partidos-activos',
  templateUrl: './partidos-activos.component.html',
  styleUrls: ['./partidos-activos.component.css']
})
export class PartidosActivosComponent implements OnInit {
  partidos:any;
  constructor(
    private partidosService: PartidosService,
  ) { }

  ngOnInit() {
    this.loadPartidos();
  }

  loadPartidos() {
    this.partidosService.getAllPartidosActivos()
    .subscribe(
      partidos => this.partidos = partidos,
      err => console.log(err)
    );
  }

}
