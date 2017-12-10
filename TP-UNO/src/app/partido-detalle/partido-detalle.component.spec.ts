import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoDetalleComponent } from './partido-detalle.component';

describe('PartidoDetalleComponent', () => {
  let component: PartidoDetalleComponent;
  let fixture: ComponentFixture<PartidoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartidoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
