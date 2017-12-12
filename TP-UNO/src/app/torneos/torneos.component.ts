import { Component, OnInit } from '@angular/core';
import { TorneosService } from "../services/torneos.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.component.html',
  styleUrls: ['./torneos.component.css']
})
export class TorneosComponent implements OnInit {

  torneos: any = [{
    nombre: '',
    logo: '',
    imagen_trofeo: ''
  }]
  constructor(private torneosService: TorneosService) { }

  ngOnInit() {
    this.loadTorneos()
  }

  loadTorneos() {
    this.torneosService.getAllTorneos()
                          .subscribe(
                            torneos => this.torneos = torneos,
                            err => console.log(err)
                          );
  }

}

