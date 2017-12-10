import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPartidosComponent } from './formulario-partidos.component';

describe('FormularioPartidosComponent', () => {
  let component: FormularioPartidosComponent;
  let fixture: ComponentFixture<FormularioPartidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioPartidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
