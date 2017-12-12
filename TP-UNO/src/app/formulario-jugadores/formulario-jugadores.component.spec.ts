import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioJugadoresComponent } from './formulario-jugadores.component';

describe('FormularioJugadoresComponent', () => {
  let component: FormularioJugadoresComponent;
  let fixture: ComponentFixture<FormularioJugadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioJugadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioJugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
