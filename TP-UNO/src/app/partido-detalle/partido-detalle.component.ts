import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PartidosService } from "../services/partidos.service";

@Component({
  selector: 'app-partido-detalle',
  templateUrl: './partido-detalle.component.html',
  styleUrls: ['./partido-detalle.component.css']
})
export class PartidoDetalleComponent implements OnInit {
  partido: any;

  constructor(
    private route: ActivatedRoute,
    private partidosService: PartidosService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.partidosService.getPartido(params['id'])
      .subscribe(
        partido => this.partido = partido,
        err => console.log(err)
      );
    });
  }
}
