import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidosActivosComponent } from './partidos-activos.component';

describe('PartidosActivosComponent', () => {
  let component: PartidosActivosComponent;
  let fixture: ComponentFixture<PartidosActivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartidosActivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidosActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
