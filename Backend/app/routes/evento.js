var mongoose = require('mongoose');
var Evento = mongoose.model('evento');
var Partido = mongoose.model('partido');
var Tipo_evento = mongoose.model('tipo_evento');
var Jugador = mongoose.model('jugador');
var Equipo = mongoose.model('equipo');
var router=require('express').Router()


//GET ALL
router.get('/', (req, res, next) => {
  Evento.
    find().
    populate('tipo_evento').
    populate('partido').
    populate('equipo').
    populate('jugador').
    exec(function (err, evento) {
      if (err) {
        res.send(err);
      }
      else if(evento.length != 0) {
        res.json(evento);
      }
      else {
        res.send("Ningún evento encontrado");
      }
    });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Evento.
    findOne({_id: req.params.id}).
    populate('tipo_evento').
    populate('partido').
    populate('equipo').
    populate('jugador').
    exec(function (err, evento) {
      if (err) {
        res.send(err);
      }
      else if(evento.length != 0) {
        res.json(evento);
      }
      else {
        res.send("Ningún evento encontrado");
      }
    });
});

//Create
router.post('/', (req, res, next) => {
  Partido.findOne({_id: req.body.partido}, (err, correcto) => {
    if(err){
      res.send(err);
    }
    else if (correcto != null) {
      if(req.body.tiempo_ocurrencia <= 90 && req.body.tiempo_ocurrencia >= 0) {
        var today = new Date();
        today.setHours(today.getHours() - 3);
        if (correcto.fecha_hora > (today.getTime() - (6300000)) &&
        correcto.fecha_hora < today.getTime()) {
          let tiempo_ocurrenciaNuevo = req.body.tiempo_ocurrencia;
          let partidoNuevo = req.body.partido;
          Tipo_evento.findOne({_id: req.body.tipo_evento}, (err, te) => {
            if(err) {
              res.send(err);
            }
            else if(te != null) {
              let tipo_eventoNuevo = req.body.tipo_evento;
              if(req.body.equipo) {
                Equipo.findOne({_id: req.body.equipo}, (err, eq) => {
                  if(err) {
                    res.send(err);
                  }
                  else if(eq != null) {
                    if(req.body.jugador) {
                      Jugador.findOne({_id: req.body.jugador}, (err, ju) => {
                        if(err) {
                          res.send(err);
                        }
                        else if(ju != null) {
                          let equipoNuevo = req.body.equipo;
                          let jugadorNuevo = req.body.jugador;
                          var eventoNuevo = new Evento({
                            tiempo_ocurrencia: tiempo_ocurrenciaNuevo,
                            partido: partidoNuevo,
                            tipo_evento: tipo_eventoNuevo,
                            equipo: equipoNuevo,
                            jugador: jugadorNuevo
                          });
                          eventoNuevo.save((err, eventoCreado) => {
                            if(err) {
                              res.send(err);
                            }
                            else {
                              correcto.eventos.push(eventoCreado._id);
                              correcto.save((err, partidoGuardado) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  res.send("Evento creado correctamente con equipo y jugador");
                                }
                              });
                            }
                          });
                        }
                        else {
                          res.send("No existe ese jugador");
                        }
                      });
                    }
                    else {
                      res.send("Un evento que pertenece a un equipo, también debe pertenecer a un jugador");
                    }
                  }
                  else {
                    res.send("No existe ese Equipo");
                  }
                });
              }
              else {
                var eventoNuevo = new Evento({
                  tiempo_ocurrencia: tiempo_ocurrenciaNuevo,
                  partido: partidoNuevo,
                  tipo_evento: tipo_eventoNuevo
                });
                eventoNuevo.save((err, eventoCreado) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    correcto.eventos.push(eventoCreado._id);
                    correcto.save((err, partidoGuardado) => {
                      if(err) {
                        res.send(err);
                      }
                      else {
                        res.send("Evento sin equipo ni jugador creado correctamente");
                      }
                    });
                  }
                });
              }
            }
            else {
              res.send("No existe ese tipo de evento");
            }
          });
        }
        else {
          res.send("El partido no está en curso, por lo tanto no se le pueden crear eventos");
        }
      }
      else {
        res.send("El tiempo de ocurrencia debe ser entre 0 y 90");
      }
    }
    else {
      res.send("No existe ese partido");
    }
  });
});
        

//UPDATE
/* 
Se puede modificar todo de un evento, menos el partido en el que ocurrió, 
ya que no tendría sentido.
*/
router.put('/:id', (req, res, next) => {
    Evento.findOne({_id: req.params.id},function(err, result){
      if (err) {
        res.status(500).send(err);
      } 
      else if (result != null) {
        result.tiempo_ocurrencia = req.body.tiempo_ocurrencia || result.tiempo_ocurrencia;
        result.tipo_evento = req.body.tipo_evento || result.tipo_evento;
        result.equipo = req.body.equipo || result.equipo;
        result.jugador = req.body.jugador || result.jugador;
        result.save((err, resultado) => {
          if(err) {
            res.send(err)
          }
          else {
            res.send("Evento modificado correctamente");
          }
        });
      }
      else {
        res.send("El evento que quiere modificar no existe");
      }
    });
})


//DELETE ONE
/*   
El método se encarga de borrar el evento deseado, 
y de borrar dicho evento del arreglo de eventos del partido.
*/
router.delete('/:id', (req, res, next) => {
  Evento.findOne({_id: req.params.id}).
  populate('partido').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result != null) {                                                                                               
      result.remove((err, deleteEvento) => {
        if(err) {
          res.send(err);
        }
        else {
          Partido.findOne({_id: result.partido._id}).
          populate('eventos').
          exec((err, pa) => {
            if(err) {
              res.send(err);
            }
            else if (pa != null) {
              for(var i = 0; i < pa.eventos.length; i++) {
                if(pa.eventos[i]._id == result._id) {
                  var removed = pa.eventos.splice(i,1);
                  pa.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      res.send("Evento eliminado con éxito");
                    }
                  });                                                 
                }                                                                          
              }
            }
            else {
              "No existe el partido al que pertenece el evento que desea eliminar";
            }
          })
        }
      })
    }
    else {
      res.send("No existe el Evento que desea eliminar");
    }
  });
});

module.exports=router;                                                                                              