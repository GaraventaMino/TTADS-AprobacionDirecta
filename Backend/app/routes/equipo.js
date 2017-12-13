var mongoose = require('mongoose');
var Equipo = mongoose.model('equipo');
var Estadio = mongoose.model('estadio');
var Torneo = mongoose.model('torneo');
var Evento = mongoose.model('evento');
var Partido = mongoose.model('partido');
var router=require('express').Router()


//GET ALL
router.get('/', (req, res, next) => {
  Equipo.find().
  populate('jugadores').
  populate('estadio').
  populate('torneo').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if (result.length != 0) {
      res.json(result);
    }
    else {
      res.json("No existe ningún equipo");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Equipo.findOne({_id: req.params.id}).
  populate('jugadores').
  populate('estadio').
  populate('torneo').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if(result != null) {
      res.json(result);
    } 
    else {
      res.json("No existe el equipo buscado");
    } 
  });
});

//CREATE
/* 
En este método se puede asignar el estadio y el torneo de mi nuevo equipo y el método
mismo se encargá de guardar en el modelo "Estadio" y en el modelo "Torneo" este nuevo equipo.
*/
router.post('/', (req, res, next) => {
  let nombreNuevo=req.body.nombre;
  let tecnicoNuevo=req.body.tecnico;
  let escudoNuevo=req.body.escudo;
  let estadioNuevo=null;
  let torneoNuevo=null;
  if(req.body.estadio) {
    //Se le asigno un estadio al equipo
    Estadio.findOne({_id: req.body.estadio}, (error, estad) => {
      if (error) {
        res.send(error);
      }
      else if (estad != null) {
        if(estad.equipo != null) {
          res.json("El estadio seleccionado ya pertenece a un equipo");
        }
        else { 
          estadioNuevo = estad._id;          
          if(req.body.torneo) {
            //Se agrega torneo y estadio                
            Torneo.findOne({_id: req.body.torneo}, (error, torn) => {
              if (error) {
                res.send(error);
              }
              else if (torn != null) {
                let torneoNuevo = torn._id;
                var equipoNuevo = new Equipo({
                  nombre: nombreNuevo,
                  tecnico: tecnicoNuevo,
                  estadio: estadioNuevo,
                  escudo: escudoNuevo,
                  torneo: torneoNuevo
                });
                equipoNuevo.save((err, equipoGuardado) => {
                  if(err){
                    res.send(err);
                  }
                  else {                      
                    estad.equipo = equipoGuardado._id;
                    estad.save((err) => {
                      if(err){
                        res.send(err);
                      }
                      else {                        
                        torn.equipos.push(equipoGuardado._id);
                        torn.save((err) => {
                          if(err){
                            res.send(err);
                          }
                          else {
                            res.json("Equipo creado correctamente con estadio y torneo");
                          }
                        });
                      }
                    });
                  }
                });
              }  
              else {
                res.json("El torneo seleccionado no existe");
              }                      
            });
          }  
          else {
            //Solo se le agrega estadio pero no torneo
            var equipoNuevo = new Equipo({
              nombre: nombreNuevo,
              tecnico: tecnicoNuevo,
              estadio: estadioNuevo,
              escudo: escudoNuevo,
              torneo: torneoNuevo
            });
            equipoNuevo.save((err, equipoGuardado) => {
              if(err) {
                res.send(err);
              }
              else {
                estad.equipo = equipoGuardado._id;
                estad.save((err) => {
                  if(err){
                    res.send(err);
                  }
                  else {
                    res.json("Equipo creado correctamente con estadio pero sin torneo");
                  }
                });
              }                  
            });
          } 
        } 
      }              
      else {
        res.json("El estadio que se ingreso no existe");
      }
    });
  }
  else if(req.body.torneo) {
    //Se agrega torneo pero no estadio
    Torneo.findOne({_id: req.body.torneo}, (error, torn) => {
      if (error) {
        res.send(error);
      }
      else if (torn != null) {
        torneoNuevo = torn._id;
        var equipoNuevo = new Equipo({
          nombre: nombreNuevo,
          tecnico: tecnicoNuevo,
          escudo: escudoNuevo,
          estadio: estadioNuevo,
          torneo: torneosNuevo
        });
        equipoNuevo.save((err, equipoGuardado) => {
          if(err){
            res.send(err);
          }
          else {                 
            torn.equipos.push(equipoGuardado._id);
            torn.save((err) => {
              if(err){
                res.send(err);
              }
              else {
                res.json("Equipo creado correctamente con torneos pero sin estadios");
              }
            });
          }
        });
      }  
      else {
        res.json("Algún torneo seleccionado no existe");
      } 
    });
  }
  else {
    //No se agrega estadio ni torneo
    var equipoNuevo = new Equipo({
      nombre: nombreNuevo,
      tecnico: tecnicoNuevo,
      escudo: escudoNuevo,
      estadio: estadioNuevo,
      torneo: torneoNuevo
    });
    equipoNuevo.save((err, equipoGuardado) => {
      if(err){
        res.send(err);
      }
      else {
        res.json("Equipo creado correctamente sin estadios ni torneos");
      }
    });
  }
});


//UPDATE
router.put('/:id', (req, res, next) => {
  Equipo.findOne({_id: req.params.id}).
  exec((err, result) => {
    if (err) {
      res.send(err);
    } 
    else if (result != null) {
      //Modifico nombre, tecnico y/o o escudo si se solicita

      result.nombre = req.body.nombre || result.nombre;
      result.tecnico = req.body.tecnico || result.tecnico;
      result.escudo = req.body.escudo || result.escudo;
      if (req.body.torneo) {
        //Vino un torneo en el post
        
        if(result.torneo != null) {
          //Ya tiene torneo el equipo

          if(result.torneo.equals(req.body.torneo)) {
            //Es el mismo que vino en el post. Proseguir con estadio

            if(req.body.estadio) {
              if(result.estadio != null) {
                if(result.estadio.equals(req.body.estadio)) {
                  result.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      res.json("Equipo modificado (no se modifico ni su estadio ni su torneo)")
                    }
                  });
                }
                else {
                  Estadio.findOne({_id: result.estadio}, (err, es) => {
                    if(err) {
                      res.send(err);
                    }
                    else if(es != null) {
                      es.equipo = null;
                      es.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          Estadio.findOne({_id: req.body.estadio}, (err, e) => {
                            if(err) {
                              res.send(err);
                            }
                            else if(e != null) {
                              result.estadio = req.body.estadio;
                              e.equipo = result._id;
                              result.save((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  e.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      res.json("Equipo modificado (El torneo sigue igual. Tenia un estadio pero ahora tiene otro)")
                                    }
                                  });
                                }
                              });
                            }
                            else {
                              res.json("El estadio que se ingreso no existe");
                            }
                          });                          
                        }
                      });
                    }
                    else {
                      res.json("Error al encontrar el estadio que tiene el equipo. NO DEBERIA PASAR ESTO");
                    }
                  });
                }
              }
              else {
                Estadio.findOne({_id: req.body.estadio}, (err, es) => {
                  if(err) {
                    res.send(err);
                  }
                  else if(es != null) {
                    result.estadio = req.body.estadio;
                    es.equipo = result._id;
                    result.save((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else {
                        es.save((err) => {
                          if(err) {
                            res.send(err);
                          }
                          else {
                            res.json("Equipo modificado (Torneo sigue igual. Estadio no tenia, ahora se le agregó)");
                          }
                        });
                      }
                    });
                  }
                  else {
                    res.json("El estadio que se ingreso no existe");
                  }
                });
              }

            }
            else if(result.estadio != null) {
              Estadio.findOne({_id: result.estadio}, (err, es) => {
                if(err) {
                  res.send(err);
                }
                else if(es != null) {
                  result.estadio = null;
                  es.equipo = null;
                  result.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      es.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          res.json("Equipo modificado (torneo sigue igual. Estadio tenia, ahora se le borro");
                        }
                      });
                    }
                  });
                }
                else {
                  res.json("Error al buscar el estadio que tenia el equipo. NO DEBERIA PASAR ESTO")
                }
              });
            }
            else {
              res.json("Equipo modificado (torneo sigue igual. estadio no tenia y sigue sin tener)");
            }
          }
          else {
            //Es un torneo nuevo. Borrar el torneo existente, agregar el nuevo y proseguir con estadio

            Torneo.findOne({_id: result.torneo}).
            populate('equipos').
            exec((err, to) => {
              if(err) {
                res.send(err);
              }
              else if(to != null) {
                Torneo.findOne({_id: req.body.torneo}).
                populate('equipos').
                exec((err, t) => {
                  if(err) {
                    res.send(err);
                  }
                  else if(t != null) {
                    for(var i = 0; i < to.equipos.length; i++) {
                      if(to.equipos[i]._id.equals(result._id)) {
                        var removed = to.equipos.splice(i, 1);
                        result.torneo = req.body.torneo;
                        to.save((err) => {
                          if(err) {
                            res.send(err);
                          }
                          else {
                            result.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                t.equipos.push(result._id);
                                t.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else {
                                    //Seguir con estadio
                                    if(req.body.estadio) {
                                      if(result.estadio != null) {
                                        if(result.estadio.equals(req.body.estadio)) {
                                          res.json("Equipo modificado (Tenia torneo pero se cambio por otro. No se modifico su estadio)")
                                        }
                                        else {
                                          Estadio.findOne({_id: result.estadio}, (err, es) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else if(es != null) {
                                              es.equipo = null;
                                              es.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else {
                                                  Estadio.findOne({_id: req.body.estadio}, (err, e) => {
                                                    if(err) {
                                                      res.send(err);
                                                    }
                                                    else if(e != null) {
                                                      result.estadio = req.body.estadio;
                                                      e.equipo = result._id;
                                                      result.save((err) => {
                                                        if(err) {
                                                          res.send(err);
                                                        }
                                                        else {
                                                          e.save((err) => {
                                                            if(err) {
                                                              res.send(err);
                                                            }
                                                            else {
                                                              res.json("Equipo modificado (Tenia torneo pero se cambio por otro. Tenia un estadio pero ahora tiene otro)")
                                                            }
                                                          });
                                                        }
                                                      });
                                                    }
                                                    else {
                                                      res.json("El estadio que se ingreso no existe");
                                                    }
                                                  });                          
                                                }
                                              });
                                            }
                                            else {
                                              res.json("Error al encontrar el estadio que tiene el equipo. NO DEBERIA PASAR ESTO");
                                            }
                                          });
                                        }
                                      }
                                      else {
                                        Estadio.findOne({_id: req.body.estadio}, (err, es) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else if(es != null) {
                                            result.estadio = req.body.estadio;
                                            es.equipo = result._id;
                                            result.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else {
                                                es.save((err) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else {
                                                    res.json("Equipo modificado (Tenia torneo pero se cambio por otro. Estadio no tenia, ahora se le agregó)");
                                                  }
                                                });
                                              }
                                            });
                                          }
                                          else {
                                            res.json("El estadio que se ingreso no existe");
                                          }
                                        });
                                      }

                                    }
                                    else if(result.estadio != null) {
                                      Estadio.findOne({_id: result.estadio}, (err, es) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if(es != null) {
                                          result.estadio = null;
                                          es.equipo = null;
                                          result.save((err) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else {
                                              es.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else {
                                                  res.json("Equipo modificado (Tenia torneo pero se cambio por otro. Estadio tenia, ahora se le borro");
                                                }
                                              });
                                            }
                                          });
                                        }
                                        else {
                                          res.json("Error al buscar el estadio que tenia el equipo. NO DEBERIA PASAR ESTO")
                                        }
                                      });
                                    }
                                    else {
                                      res.json("Equipo modificado (Tenia torneo pero se cambio por otro. Estadio no tenia y sigue sin tener)");
                                    }
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
                    res.json("El torneo que se ingreso no existe");
                  }
                });
              }
              else {
                res.json("Error al buscar el torneo que tenia el equipo. NO DEBERIA PASAR ESTO");
              }
            });
          }
        }
        else {
          //Hay que agregarle el torneo y proseguir con estadio

          Torneo.findOne({_id: req.body.torneo}).
          populate('equipos').
          exec((err, to) => {
            if(err) {
              res.send(err);
            }
            else if(to != null) {
              result.torneo = req.body.torneo;
              to.equipos.push(result._id);
              result.save((err) => {
                if(err) {
                  res.send(err);
                }
                else {
                  to.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      //Seguir con estadio

                      if(req.body.estadio) {
                        if(result.estadio != null) {
                          if(result.estadio.equals(req.body.estadio)) {
                            res.json("Equipo modificado (no se modifico su estadio. No tenia torneo y ahora se le agrego)")
                          }
                          else {
                            Estadio.findOne({_id: result.estadio}, (err, es) => {
                              if(err) {
                                res.send(err);
                              }
                              else if(es != null) {
                                es.equipo = null;
                                es.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else {
                                    Estadio.findOne({_id: req.body.estadio}, (err, e) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else if(e != null) {
                                        result.estadio = req.body.estadio;
                                        e.equipo = result._id;
                                        result.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else {
                                            e.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else {
                                                res.json("Equipo modificado (No tenia torneo y ahora se le agrego. Tenia un estadio pero ahora tiene otro)")
                                              }
                                            });
                                          }
                                        });
                                      }
                                      else {
                                        res.json("El estadio que se ingreso no existe");
                                      }
                                    });                          
                                  }
                                });
                              }
                              else {
                                res.json("Error al encontrar el estadio que tiene el equipo. NO DEBERIA PASAR ESTO");
                              }
                            });
                          }
                        }
                        else {
                          Estadio.findOne({_id: req.body.estadio}, (err, es) => {
                            if(err) {
                              res.send(err);
                            }
                            else if(es != null) {
                              result.estadio = req.body.estadio;
                              es.equipo = result._id;
                              result.save((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  es.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      res.json("Equipo modificado (No tenia torneo y ahora se le agrego. Estadio no tenia, ahora se le agregó)");
                                    }
                                  });
                                }
                              });
                            }
                            else {
                              res.json("El estadio que se ingreso no existe");
                            }
                          });
                        }
                      }
                      else if(result.estadio != null) {
                        Estadio.findOne({_id: result.estadio}, (err, es) => {
                          if(err) {
                            res.send(err);
                          }
                          else if(es != null) {
                            result.estadio = null;
                            es.equipo = null;
                            result.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                es.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else {
                                    res.json("Equipo modificado (No tenia torneo y ahora se le agrego. Estadio tenia, ahora se le borro");
                                  }
                                });
                              }
                            });
                          }
                          else {
                            res.json("Error al buscar el estadio que tenia el equipo. NO DEBERIA PASAR ESTO")
                          }
                        });
                      }
                      else {
                        result.save((err) => {
                          if(err) {
                            res.send(err);
                          }
                          else {
                            res.json("Equipo modificado (No tenia torneo y ahora se le agrego. estadio no tenia y sigue sin tener)");
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
            else {
              res.json("El torneo que se ingreso no existe");
            }
          });
        }
      }
      else {
        //No vino torneo en el post

        if(result.torneo != null) {
          //Tiene torneo. Borrarselo y proseguir con estadio

          Torneo.findOne({_id: result.torneo}).
          populate('equipos').
          exec((err, to) => {
            if(err) {
              res.send(err);
            }
            else if(to != null) {
              for(var i = 0; i < to.equipos.length; i++) {
                if(to.equipos[i]._id.equals(result._id)) {
                  var removed = to.equipos.splice(i, 1);
                  result.torneo = null;
                  to.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      result.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          //Seguir con estadio

                          if(req.body.estadio) {
                            if(result.estadio != null) {
                              if(result.estadio.equals(req.body.estadio)) {
                                res.json("Equipo modificado (no se modifico su estadio. Tenia torneo y ahora se le borro)")
                              }
                              else {
                                Estadio.findOne({_id: result.estadio}, (err, es) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else if(es != null) {
                                    es.equipo = null;
                                    es.save((err) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else {
                                        Estadio.findOne({_id: req.body.estadio}, (err, e) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else if(e != null) {
                                            result.estadio = req.body.estadio;
                                            e.equipo = result._id;
                                            result.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else {
                                                e.save((err) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else {
                                                    res.json("Equipo modificado (Tenia torneo y ahora se le borro. Tenia un estadio pero ahora tiene otro)")
                                                  }
                                                });
                                              }
                                            });
                                          }
                                          else {
                                            res.json("El estadio que se ingreso no existe");
                                          }
                                        });                          
                                      }
                                    });
                                  }
                                  else {
                                    res.json("Error al encontrar el estadio que tiene el equipo. NO DEBERIA PASAR ESTO");
                                  }
                                });
                              }
                            }
                            else {
                              Estadio.findOne({_id: req.body.estadio}, (err, es) => {
                                if(err) {
                                  res.send(err);
                                }
                                else if(es != null) {
                                  result.estadio = req.body.estadio;
                                  es.equipo = result._id;
                                  result.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      es.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else {
                                          res.json("Equipo modificado (Tenia torneo y ahora se le borro. Estadio no tenia, ahora se le agregó)");
                                        }
                                      });
                                    }
                                  });
                                }
                                else {
                                  res.json("El estadio que se ingreso no existe");
                                }
                              });
                            }
                          }
                          else if(result.estadio != null) {
                            Estadio.findOne({_id: result.estadio}, (err, es) => {
                              if(err) {
                                res.send(err);
                              }
                              else if(es != null) {
                                result.estadio = null;
                                es.equipo = null;
                                result.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else {
                                    es.save((err) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else {
                                        res.json("Equipo modificado (Tenia torneo y ahora se le borro. Estadio tenia, ahora se le borro");
                                      }
                                    });
                                  }
                                });
                              }
                              else {
                                res.json("Error al buscar el estadio que tenia el equipo. NO DEBERIA PASAR ESTO")
                              }
                            });
                          }
                          else {
                            result.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                res.json("Equipo modificado (Tenia torneo y ahora se le borro. estadio no tenia y sigue sin tener)");
                              }
                            });
                          }
                        }
                      });
                    }
                  });
                }
              }
            }
            else {
              res.json("Error al buscar el torneo del equipo. NO DEBERIA PASAR ESTO");
            }
          });
        }
        else {
          //No tiene torneo. Proseguir con estadio
          if(req.body.estadio) {
            if(result.estadio != null) {
              if(result.estadio.equals(req.body.estadio)) {
                result.save((err) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    res.json("Equipo modificado (no se modifico su estadio. No tenia torneo sigue asi)")
                  }
                });
              }
              else {
                Estadio.findOne({_id: result.estadio}, (err, es) => {
                  if(err) {
                    res.send(err);
                  }
                  else if(es != null) {
                    es.equipo = null;
                    es.save((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else {
                        Estadio.findOne({_id: req.body.estadio}, (err, e) => {
                          if(err) {
                            res.send(err);
                          }
                          else if(e != null) {
                            result.estadio = req.body.estadio;
                            e.equipo = result._id;
                            result.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                e.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else {
                                    res.json("Equipo modificado (No tenia torneo sigue asi. Tenia un estadio pero ahora tiene otro)")
                                  }
                                });
                              }
                            });
                          }
                          else {
                            res.json("El estadio que se ingreso no existe");
                          }
                        });                          
                      }
                    });
                  }
                  else {
                    res.json("Error al encontrar el estadio que tiene el equipo. NO DEBERIA PASAR ESTO");
                  }
                });
              }
            }
            else {
              Estadio.findOne({_id: req.body.estadio}, (err, es) => {
                if(err) {
                  res.send(err);
                }
                else if(es != null) {
                  result.estadio = req.body.estadio;
                  es.equipo = result._id;
                  result.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      es.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          res.json("Equipo modificado (No tenia torneo sigue asi. Estadio no tenia, ahora se le agregó)");
                        }
                      });
                    }
                  });
                }
                else {
                  res.json("El estadio que se ingreso no existe");
                }
              });
            }
          }
          else if(result.estadio != null) {
            Estadio.findOne({_id: result.estadio}, (err, es) => {
              if(err) {
                res.send(err);
              }
              else if(es != null) {
                result.estadio = null;
                es.equipo = null;
                result.save((err) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    es.save((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else {
                        res.json("Equipo modificado (No tenia torneo sigue asi. Estadio tenia, ahora se le borro");
                      }
                    });
                  }
                });
              }
              else {
                res.json("Error al buscar el estadio que tenia el equipo. NO DEBERIA PASAR ESTO")
              }
            });
          }
          else {
            result.save((err) => {
              if(err) {
                res.send(err);
              }
              else {
                res.json("Equipo modificado (No tenia torneo y sigue asi. Estadio no tenia y sigue sin tener)");
              }
            });
          }
        }
      } 
    }
    else {
      res.json("El equipo que desea modificar no existe");
    }
  });
});  


//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Equipo.findOne({_id: req.params.id}).
  populate('torneo').
  populate('estadio').
  populate('jugadores').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result != null) {
      if(result.torneo == null && result.jugadores.length == 0) {
        if(result.estadio == null) {
          Evento.find({}, 'equipo').
          populate('equipo').
          exec((err, eventos) => {
            if(err){
              res.send(err);
            }
            else if (eventos.length != 0) {
              var continuar = 1;
              for(var i = 0; i < eventos.length; i++) {
                if(eventos[i].equipo._id == result._id) {
                  res.json("No se puede borrar el equipo porque se utiliza en un evento de algun partido");
                }
                else if(continuar == eventos.length) {
                  Partido.find({}, 'equipo_local equipo_visitante').
                  populate('equipo_local').
                  populate('equipo_visitante').
                  exec((err, partidos) => {
                    if(err){
                      res.send(err);
                    }
                    else if (partidos.length != 0) {
                      var continuar2 = 1;
                      for(var j = 0; j < partidos.length; j++) {
                        if(partidos[j].equipo_local._id == result._id || 
                        partidos[j].equipo_visitante._id == result._id) {
                          res.json("No se puede borrar el equipo porque se utiliza en un partido");
                        }
                        else if (continuar2 == partidos.length) {
                          result.remove((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else {
                              res.json("Equipo eliminado correctamente");
                            }
                          });
                        }
                        else {
                          continuar2++;
                        }
                      }
                    }                  
                  });
                }
                else {
                  continuar++;
                }
              }            
            }
            else {
              Partido.find({}, 'equipo_local equipo_visitante').
              populate('equipo_local').
              populate('equipo_visitante').
              exec((err, partidos) => {
                if(err){
                  res.send(err);
                }
                else if (partidos.length != 0) {
                  var continuar2 = 1;
                  for(var j = 0; j < partidos.length; j++) {
                    if(partidos[j].equipo_local._id == result._id || 
                    partidos[j].equipo_visitante._id == result._id) {
                      res.json("No se puede borrar el equipo porque se utiliza en un partido");
                    }
                    else if (continuar2 == partidos.length) {
                      result.remove((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          res.json("Equipo eliminado correctamente");
                        }
                      });
                    }
                    else {
                      continuar2++;
                    }
                  }
                }
                else {
                  result.remove((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      res.json("Equipo eliminado correctamente");
                    }
                  });
                }                  
              });
            }
          });
        }
        else {
          Estadio.findOne({_id: result.estadio._id}, (err, es) => {
            if(err) {
              res.send(err);
            }
            else if(es != null) {
              Evento.find({}, 'equipo').
              populate('equipo').
              exec((err, eventos) => {
                if(err){
                  res.send(err);
                }
                else if (eventos.length != 0) {
                  var continuar = 1;
                  for(var i = 0; i < eventos.length; i++) {
                    if(eventos[i].equipo._id == result._id) {
                      res.json("No se puede borrar el equipo porque se utiliza en un evento de algun partido");
                    }
                    else if(continuar == eventos.length) {
                      Partido.find({}, 'equipo_local equipo_visitante').
                      populate('equipo_local').
                      populate('equipo_visitante').
                      exec((err, partidos) => {
                        if(err){
                          res.send(err);
                        }
                        else if (partidos.length != 0) {
                          var continuar2 = 1;
                          for(var j = 0; j < partidos.length; j++) {
                            if(partidos[j].equipo_local._id == result._id || 
                            partidos[j].equipo_visitante._id == result._id) {
                              res.json("No se puede borrar el equipo porque se utiliza en un partido");
                            }
                            else if (continuar2 == partidos.length) {
                              es.equipo = null;
                              es.save((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  result.remove((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      res.json("Equipo eliminado correctamente(tenia estadio)");
                                    }
                                  });
                                }
                              });                              
                            }
                            else {
                              continuar2++;
                            }
                          }
                        }                  
                      });
                    }
                    else {
                      continuar++;
                    }
                  }            
                }
                else {
                  Partido.find({}, 'equipo_local equipo_visitante').
                  populate('equipo_local').
                  populate('equipo_visitante').
                  exec((err, partidos) => {
                    if(err){
                      res.send(err);
                    }
                    else if (partidos.length != 0) {
                      var continuar2 = 1;
                      for(var j = 0; j < partidos.length; j++) {
                        if(partidos[j].equipo_local._id == result._id || 
                        partidos[j].equipo_visitante._id == result._id) {
                          res.json("No se puede borrar el equipo porque se utiliza en un partido");
                        }
                        else if (continuar2 == partidos.length) {
                          es.equipo = null;
                          es.save((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else {
                              result.remove((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  res.json("Equipo eliminado correctamente(tenia estadio)");
                                }
                              });
                            }
                          });
                        }
                        else {
                          continuar2++;
                        }
                      }
                    }
                    else {
                      es.equipo = null;
                      es.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          result.remove((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else {
                              res.json("Equipo eliminado correctamente(tenia estadio)");
                            }
                          });
                        }
                      });
                    }                  
                  });
                }
              });
            }
            else {
              res.json("Error al buscar el estadio del equipo. NO DEBERIA PASAR ESTO");
            }
          });
        }
      }
      else {
        res.json("No se puede borrar el equipo porque pertenece a un torneo/estadio/jugador");
      }
    } 
    else {
      res.json("El equipo no existe");
    }   
  });
});
      

module.exports=router;
