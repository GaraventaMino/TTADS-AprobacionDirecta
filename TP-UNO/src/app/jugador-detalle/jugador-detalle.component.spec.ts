import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadorDetalleComponent } from './jugador-detalle.component';

describe('JugadorDetalleComponent', () => {
  let component: JugadorDetalleComponent;
  let fixture: ComponentFixture<JugadorDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JugadorDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JugadorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
