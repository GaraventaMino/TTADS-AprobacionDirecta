import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioTorneosComponent } from './formulario-torneos.component';

describe('FormularioTorneosComponent', () => {
  let component: FormularioTorneosComponent;
  let fixture: ComponentFixture<FormularioTorneosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioTorneosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioTorneosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
