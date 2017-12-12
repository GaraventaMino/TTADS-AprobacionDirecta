import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PrincipalComponent } from './principal/principal.component';
import { HttpModule, JsonpModule }    from '@angular/http';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { LogoComponent } from './logo/logo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MdListModule, MdSelectModule, MdCardModule, MdInputModule, MdSlideToggleModule, MdFormFieldModule, MdTooltipModule, MdMenuModule, MdButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule }   from '@angular/router';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { PeliculasService } from "./peliculas.service";
import { TorneosService } from "./services/torneos.service";
import { JugadoresService } from "./services/jugadores.service";
import { EquiposService } from "./services/equipos.service";
import { EstadiosService } from "./services/estadios.service";
import { ArbitrosService } from "./services/arbitros.service";
import { PartidosService } from "./services/partidos.service";
import {RatingModule} from "ngx-rating";
import { MenuOpcionesComponent } from './menu-opciones/menu-opciones.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { TorneosComponent } from './torneos/torneos.component';
import { FormularioTorneosComponent } from './formulario-torneos/formulario-torneos.component';
import { TorneoDetalleComponent } from './torneo-detalle/torneo-detalle.component';
import { FormularioEquiposComponent } from './formulario-equipos/formulario-equipos.component';
import { FormularioJugadoresComponent } from './formulario-jugadores/formulario-jugadores.component';
import { FormularioPartidosComponent } from './formulario-partidos/formulario-partidos.component';
import { EquiposComponent } from './equipos/equipos.component';
import { PartidosComponent } from './partidos/partidos.component';
import { PartidoDetalleComponent } from './partido-detalle/partido-detalle.component';
import { PartidosActivosComponent } from './partidos-activos/partidos-activos.component';
import { EquipoDetalleComponent } from './equipo-detalle/equipo-detalle.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { JugadorDetalleComponent } from './jugador-detalle/jugador-detalle.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    Angular2FontawesomeModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MdSelectModule,
    MdCardModule,
    MdInputModule,
    MdListModule,
    MdSlideToggleModule,
    RatingModule,
    MdTooltipModule,
    MdMenuModule,
    MdButtonModule,
    MdFormFieldModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'nuevoTorneo',
        component: FormularioTorneosComponent
      },
      {
        path: '',
        redirectTo: '/principal',
        pathMatch: 'full'
      },
      {
        path: 'principal',
        component: PrincipalComponent
      },
      {
        path: 'listadoTorneos',
        component: TorneosComponent
      },
      {
        path: 'nuevoJugador',
        component: FormularioJugadoresComponent
      },
      {
        path: 'editarJugador/:id',
        component: FormularioJugadoresComponent
      },
      {
        path: 'nuevoEquipo',
        component: FormularioEquiposComponent
      },
      {
        path: 'nuevoPartido',
        component: FormularioPartidosComponent
      },
      {
        path: 'listadoEquipos',
        component: EquiposComponent
      },
      {
        path: 'detalleTorneo/:id',
        component: TorneoDetalleComponent
      },
      {
        path: 'listadoPartidos',
        component: PartidosComponent
      },
      {
        path: 'listadoPartidosActivos',
        component: PartidosActivosComponent
      },
      {
        path: 'detallePartido/:id',
        component: PartidoDetalleComponent
      },
      {
        path: 'detalleEquipo/:id',
        component: EquipoDetalleComponent
      },
      {
        path: 'listadoJugadores',
        component: JugadoresComponent
      },
      {
        path: 'detalleJugador/:id',
        component: JugadorDetalleComponent
      }
      
    ])
    
  ],

  declarations: [               
    AppComponent,
    FooterComponent,
    HeaderComponent,
    PrincipalComponent,
    LogoComponent,
    SearchbarComponent,
    MenuOpcionesComponent,
    BienvenidoComponent,
    TorneosComponent,
    FormularioTorneosComponent,
    TorneoDetalleComponent,
    FormularioEquiposComponent,
    FormularioJugadoresComponent,
    FormularioPartidosComponent,
    EquiposComponent,
    PartidosComponent,
    PartidoDetalleComponent,
    PartidosActivosComponent,
    EquipoDetalleComponent,
    JugadoresComponent,
    JugadorDetalleComponent
  ],
  providers: [ 
    PeliculasService,
    TorneosService,
    JugadoresService ,
    EquiposService,
    EstadiosService,
    ArbitrosService,
    PartidosService
],
  bootstrap: [AppComponent]
})

export class AppModule { }