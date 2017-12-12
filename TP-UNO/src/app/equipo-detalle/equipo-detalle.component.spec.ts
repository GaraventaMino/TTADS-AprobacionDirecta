import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoDetalleComponent } from './equipo-detalle.component';

describe('EquipoDetalleComponent', () => {
  let component: EquipoDetalleComponent;
  let fixture: ComponentFixture<EquipoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
