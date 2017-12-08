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
import {MdListModule, MdSelectModule, MdCardModule, MdInputModule, MdSlideToggleModule, MdTooltipModule, MdMenuModule, MdButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule }   from '@angular/router';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { PeliculasService } from "./peliculas.service";
import {RatingModule} from "ngx-rating";
import { MenuOpcionesComponent } from './menu-opciones/menu-opciones.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { TorneosComponent } from './torneos/torneos.component';
import { FormularioTorneosComponent } from './formulario-torneos/formulario-torneos.component';
import { TorneoDetalleComponent } from './torneo-detalle/torneo-detalle.component';

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
    TorneoDetalleComponent
  ],
  providers: [ PeliculasService ],
  bootstrap: [AppComponent]
})

export class AppModule { }