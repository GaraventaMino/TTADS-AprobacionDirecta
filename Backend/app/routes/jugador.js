var mongoose = require('mongoose');
var Jugador = mongoose.model('jugador');
var Equipo = mongoose.model('equipo');
var Evento = mongoose.model('evento');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Jugador.find().
  populate('equipo').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if (result.length != 0) {
      res.json(result);
    }
    else {
      res.send("No existe ningún jugador aún");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Jugador.findOne({_id: req.params.id}).
  populate('equipo').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if(result != null) {
      res.json(result);
    } 
    else {
      res.send("Ningún Jugador Encontrado");
    } 
  });
});

//CREATE
/* 
Al crear un jugador le asigno el equipo al que pertenece
*/
router.post('/', (req, res, next) => {
  if(req.body.equipo) {
    Equipo.findOne({_id: req.body.equipo}).
    populate('jugadores').
    exec((err, eq) => {
      if(err) { 
        res.send(err);
      }
      else if (eq != null) {
        let nombre=req.body.nombre;
        let edad=req.body.edad;
        let equipo=req.body.equipo;
        let imagen=req.body.imagen;
        var jugadorNuevo = new Jugador({
            nombre: nombre,
            edad: edad,
            equipo: equipo,
            imagen: imagen
        });
        jugadorNuevo.save((err, juGuardado) => {
          if(err){
            res.send(err);
          }
          else {
            eq.jugadores.push(juGuardado._id);
            eq.save((err) => {
              if(err) {
                res.send(err);
              }
              else {
                res.send("Jugador creado con éxito");
              }
            });
          }
        });
      }
      else {
        res.send("Debe asignarle un equipo existente al jugador!");
      }
    });
  }
  else {
    res.send("Debe asignarle un equipo al jugador!");
  }
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Jugador.findOne({_id: req.params.id}, (err, result) => {
    if (err) {
      res.send(err);
    } 
    else if (result != null) {
      result.nombre = req.body.nombre || result.nombre;
      result.edad = req.body.edad || result.edad;
      result.imagen = req.body.imagen || result.imagen;
      if(req.body.equipo) {
        if(req.body.equipo == result.equipo) {
          result.save((err) => {
            if(err) {
              res.send(err);
            }
            else {
              res.send("Jugador modificado. No se modifico su equipo");
            }
          });
        }
        else {
          Equipo.findOne({_id: result.equipo}).
          populate('jugadores').
          exec((err, eq) => {
            if(err) {
              res.send(err);
            }
            else if (eq != null) {
              Equipo.findOne({_id: req.body.equipo}, (err, e) => {
                if(err) {
                  res.send(err);
                }
                else if (e != null) {                  
                  result.equipo = req.body.equipo;

                  //Borro el anterior
                  for(var i = 0; i < eq.jugadores.length; i++) {
                    
                    if(eq.jugadores[i]._id.equals(result._id)) {
                      var removed = eq.jugadores.splice(i, 1);
                      eq.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          e.jugadores.push(result._id);
                          e.save((err) => {
                            if(err) {
                              res.send(err);
                            }               
                            else {
                              result.save((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  res.send("Jugador modificado (incluso el equipo)");
                                }
                              });                              
                            }             
                          });
                        }
                      });
                    }
                  }
                }
                else {
                  res.send("Se debe asignar un equipo existente al jugador");
                }
              });              
            }
            else {
              res.send("Error al intentar localizar el equipo actual del jugador. NO DEBERIA PASAR ESTO");
            }
          });
        }        
      }
      else {
        res.send("Debe asignarle un equipo al jugador")
      }      
    }
    else {
      res.send("No existe el Jugador que desea modificar");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Evento.find().
  populate('jugador').
  exec((err, ev) => {
    if(err) {
      res.send(err);
    }
    else if(ev.length != 0) {
      var continuar = 1;
      for(var i = 0; i < ev.length; i++) {
        if(ev[i].jugador._id == req.params.id) {
          res.send("El jugador no se puede eliminar, pues ya disputó partidos y fue partícipe de algún evento");
        }
        else if (continuar == ev.length) {
          Jugador.findOne({_id: req.params.id}).
          populate('equipo').
          exec((err, ju) => {
            if (err) {
              res.send(err);
            }
            else if(ju != null) {
              Equipo.findOne({_id: ju.equipo._id}).
              populate('jugadores').
              exec((err, eq) => {
                if(err) {
                  res.send(err);
                }
                else if (eq != null) {
                  for(var i = 0; i < eq.jugadores.length; i++) {
                    if(eq.jugadores[i]._id == ju._id) {
                      var removed = eq.jugadores.splice(i, 1);
                      eq.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          ju.remove((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else {
                              res.send("Jugador borrado con éxito");
                            }
                          });
                        }
                      });
                    }
                  }
                }
                else {
                  res.send("No existe el equipo que tenia asignado el jugador. No debería pasar esto");
                }
              });
            }
            else {
              res.send("No existe el Jugador que desea eliminar");
            }
          });
        }
        else {
          continuar++;
        }
      }
    }
    else {
      Jugador.findOne({_id: req.params.id}).
      populate('equipo').
      exec((err, ju) => {
        if (err) {
          res.send(err);
        }
        else if(ju != null) {
          Equipo.findOne({_id: ju.equipo._id}).
          populate('jugadores').
          exec((err, eq) => {
            if(err) {
              res.send(err);
            }
            else if (eq != null) {
              for(var i = 0; i < eq.jugadores.length; i++) {                
                if(eq.jugadores[i]._id.equals(ju._id)) {
                  var removed = eq.jugadores.splice(i, 1);
                  eq.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      ju.remove((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          res.send("Jugador borrado con éxito");
                        }
                      });
                    }
                  });
                }
                else {
                  console.log(i)
                }
              }
            }
            else {
              res.send("No existe el equipo que tenia asignado el jugador. No debería pasar esto");
            }
          });
        }
        else {
          res.send("No existe el Jugador que desea eliminar");
        }
      });
    }
  });
});


module.exports=router;