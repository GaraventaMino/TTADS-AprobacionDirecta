import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorneoDetalleComponent } from './torneo-detalle.component';

describe('TorneoDetalleComponent', () => {
  let component: TorneoDetalleComponent;
  let fixture: ComponentFixture<TorneoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorneoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorneoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
