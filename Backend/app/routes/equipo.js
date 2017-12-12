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
      res.send("No existe ningún equipo");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Equipo.findOne({_id: req.params.id}).
  populate('jugadores').
  populate({
    path: 'estadio',
    select: 'nombre direccion'
  }).  
  populate({
    path: 'torneo',
    select: 'nombre logo imagen_trofeo'
  }).
  exec(function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if(result != null) {
      res.json(result);
    } 
    else {
      res.send("No existe el equipo buscado");
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
          res.send("El estadio seleccionado ya pertenece a un equipo");
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
                            res.send("Equipo creado correctamente con estadio y torneo");
                          }
                        });
                      }
                    });
                  }
                });
              }  
              else {
                res.send("El torneo seleccionado no existe");
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
                    res.send("Equipo creado correctamente con estadio pero sin torneo");
                  }
                });
              }                  
            });
          } 
        } 
      }              
      else {
        res.send("El estadio que se ingreso no existe");
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
                res.send("Equipo creado correctamente con torneos pero sin estadios");
              }
            });
          }
        });
      }  
      else {
        res.send("Algún torneo seleccionado no existe");
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
        res.send("Equipo creado correctamente sin estadios ni torneos");
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
                      res.send("Equipo modificado (no se modifico ni su estadio ni su torneo)")
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
                                      res.send("Equipo modificado (El torneo sigue igual. Tenia un estadio pero ahora tiene otro)")
                                    }
                                  });
                                }
                              });
                            }
                            else {
                              res.send("El estadio que se ingreso no existe");
                            }
                          });                          
                        }
                      });
                    }
                    else {
                      res.send("Error al encontrar el estadio que tiene el equipo. NO DEBERIA PASAR ESTO");
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
                    result.estadio = req;
                    es.equipo = result._id;
                  }
                  else {
                    res.send("El estadio que se ingreso no existe");
                  }
                })
              }

            }
            else {
              //NO VINO ESTADIO.
            }
          }
          else {
            //Es un torneo nuevo. Borrar el torneo existente, agregar el nuevo y proseguir con estadio

          }
        }
        else {
          //Hay que agregarle el torneo y proseguir con estadio

        }
      }
      else {
        //No vino torneo en el post

        if(result.torneo != null) {
          //Tiene torneo. Borrarselo y proseguir con estadio

        }
        else {
          //No tiene torneo. Proseguir con estadio

        }
      } 
    }
    else {
      res.send("El equipo que desea modificar no existe");
    }
  });
});  
      
      






          for(var i = 0; i < result.torneos.length; i++) {
            a = 2;
            for(var w = 0; w < req.body.torneos.torneos.length; w++) {
              if (result.torneos[i]._id == req.body.torneos.torneos[w]) {
                a = 1;
              }
            }
            if (a == 2) {
              //Borro este torneo que existia (en Torneo.equipos y en Equipo.torneos)
              Torneo.findOne({_id: result.torneos[i]._id}).
              populate('equipos').
              exec((err, to) => {
                if(err) {
                  res.send(err);
                }
                else if (to != null) {
                  var removed = result.torneos.splice(i, 1);
                  for(var j = 0; j < to.equipos.length; j++) {
                    if(to.equipos[j]._id == result._id) {
                      to.equipos.splice(j, 1);
                      break;
                    }  
                  }
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
                          if(continuar1 == result.torneos.length) {
                            //Si la última iteración del loop:

                            //Comparo cada torneo que vino con todos los torneos existentes
                            //y agrego los que se desean (los que vinieron en el post y no están actualmente)
                            var continuar2 = 0;
                            for(var i = 0; i < req.body.torneos.torneos.length; i++) {
                              a = 2;
                              for(var w = 0; w < result.torneos.length; w++) {
                                if (result.torneos[w]._id == req.body.torneos.torneos[i]) {
                                  a = 1;
                                }
                              }
                              continuar2++;
                              if (a == 2) {
                                //Agrego este torneo (en Torneo.equipos y en Equipo.torneos)
                                Torneo.findOne({_id: req.body.torneos.torneos[i]}).
                                populate('equipos').
                                exec((err, to) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else if (to != null) {
                                    result.torneos.push(to._id);
                                    to.equipos.push(result._id);
                                    to.save((err) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else {
                                        result.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else if(continuar2 == req.body.torneos.torneos.length) {
                                            if (req.body.estadios) {
                                              //Vinieron estadios en el post
                                              req.body.estadios = JSON.parse(req.body.estadios);
                                              for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                                req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                                              }

                                              if(result.estadios.length != 0) {
                                                //Comparo cada estadio que tiene el equipo con todos los que vinieron
                                                //Si alguno no coincide, se elimina
                                                var continuar3 = 0;
                                                for(var i = 0; i < result.estadios.length; i++) {
                                                  b = 2;
                                                  for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                                    if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                                                      b = 1;
                                                    }
                                                  }      
                                                  continuar3++;                  
                                                  if (b == 2) {
                                                    Estadio.findOne({_id: result.estadios[i]._id}).
                                                    populate('equipo').
                                                    exec((err, es) => {
                                                      if(err) {
                                                        res.send(err);
                                                      }
                                                      else if (es != null) {
                                                        var removed = result.estadios.splice(i, 1);
                                                        es.equipo = null;
                                                        es.save((err) => {
                                                          if(err) {
                                                            res.send(err);
                                                          }
                                                          else {
                                                            result.save((err) => {
                                                              if(err) {
                                                                res.send(err);
                                                              }
                                                              else if (continuar3 == result.estadios.length) {   
                                                                
                                                                var continuar4 = 0;
                                                                for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                                                  b = 2;
                                                                  for(var w = 0; w < result.estadios.length; w++) {
                                                                    if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                                                      b = 1;
                                                                    }
                                                                  }
                                                                  continuar4++;
                                                                  if (b == 2) {
                                                                    Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                                    populate('equipo').
                                                                    exec((err, es) => {
                                                                      if(err) {
                                                                        res.send(err);
                                                                      }
                                                                      else if (es != null) {
                                                                        result.estadios.push(es._id);
                                                                        es.equipo = result._id;
                                                                        es.save((err) => {
                                                                          if(err) {
                                                                            res.send(err);
                                                                          }
                                                                          else {
                                                                            result.save((err) => {
                                                                              if(err) {
                                                                                res.send(err);
                                                                              }
                                                                              else if (continuar4 == req.body.estadios.estadios.length) {
                                                                                res.send("Equipo modificado con éxito (estadios y torneos");
                                                                              }
                                                                            });
                                                                          }
                                                                        });                                            
                                                                      }
                                                                      else {
                                                                        res.send("Algún estadio que eligió no existe");
                                                                      }
                                                                    });
                                                                  }
                                                                  else if(continuar4 == req.body.estadios.estadios.length) {
                                                                    res.send("Equipo modificado con éxito (estadios y torneos");
                                                                  }
                                                                }
                                                              }
                                                            });
                                                          }
                                                        });
                                                      }
                                                      else {
                                                        res.send("Algún estadio que eligió no existe");
                                                      }
                                                    });
                                                  }
                                                  else if (cotinuar3 == result.estadios.length) {
                                                    var continuar4 = 0;
                                                    for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                                      b = 2;
                                                      for(var w = 0; w < result.estadios.length; w++) {
                                                        if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                                          b = 1;
                                                        }
                                                      }
                                                      continuar4++;
                                                      if (b == 2) {
                                                        Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                        populate('equipo').
                                                        exec((err, es) => {
                                                          if(err) {
                                                            res.send(err);
                                                          }
                                                          else if (es != null) {
                                                            result.estadios.push(es._id);
                                                            es.equipo = result._id;
                                                            es.save((err) => {
                                                              if(err) {
                                                                res.send(err);
                                                              }
                                                              else {
                                                                result.save((err) => {
                                                                  if(err) {
                                                                    res.send(err);
                                                                  }
                                                                  else if (continuar4 == req.body.estadios.estadios.length) {
                                                                    res.send("Equipo modificado con éxito (estadios y torneos");
                                                                  }
                                                                });
                                                              }
                                                            });                                            
                                                          }
                                                          else {
                                                            res.send("Algún estadio que eligió no existe");
                                                          }
                                                        });
                                                      }
                                                      else if(continuar4 == req.body.estadios.estadios.length) {
                                                        res.send("Equipo modificado con éxito (estadios y torneos");
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                              else {
                                                //Como no tengo estadios aun, agrego todos los que vinieron
                                                var continuar6 = 0;
                                                for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                                  continuar6++;
                                                  Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                  populate('equipo').
                                                  exec((err, es) => {
                                                    if(err) {
                                                      res.send(err);
                                                    }
                                                    else if (es != null) {
                                                      result.estadios.push(es._id);
                                                      es.equipo = result._id;
                                                      es.save((err) => {
                                                        if(err) {
                                                          res.send(err);
                                                        }
                                                        else {
                                                          result.save((err) => {
                                                            if(err) {
                                                              res.send(err);
                                                            }
                                                            else if (continuar6 == req.body.estadios.estadios.length) {
                                                              res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                                            }
                                                          });
                                                        }
                                                      });
                                                    }
                                                    else {
                                                      res.send("Algún torneo que eligió no existe");
                                                    }
                                                  });
                                                }
                                              }
                                            }
                                            else {
                                              //caso en que hay que borrar todos los estadios
                                              var continuar7 = 0;
                                              Estadio.find().
                                              populate('equipo').
                                              exec((err, es) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else if (es.length != 0) {
                                                  for(var j = 0; j < es.length; j++) {    
                                                    continuar7++;                                                
                                                    if(es[j].equipo._id == result._id) {
                                                      es[j].equipo = null;                                                      
                                                      es.save((err) => {
                                                        if(err) {
                                                          res.send(err);
                                                        }
                                                        else {
                                                          for(var k = 0; k < result.estadios.length; k++) {
                                                            if(result.estadios[k]._id == es._id) {
                                                              var removed = result.estadios.splice(k, 1);
                                                              result.save((err) => {
                                                                if(err) {
                                                                  res.send(err);
                                                                }
                                                                else if (continuar7 == es.length) {
                                                                  res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                                                }
                                                              }); 
                                                            }                                                            
                                                          }
                                                        }                                                        
                                                      });
                                                    }
                                                    else if (continuar7 == es.length) {
                                                      res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                                    }                                                    
                                                  }                                                  
                                                }
                                                else {
                                                  console.log("No hay ningun estadio creado aún. No debería pasar esto");
                                                }
                                              });
                                            }                                            
                                          }
                                        });
                                      }
                                    });
                                  }
                                  else {
                                    res.send("Algún torneo que eligió no existe");
                                  }
                                });
                              }
                              else if(continuar2 == req.body.torneos.torneos.length) {
                                if (req.body.estadios) {
                                  //Vinieron estadios en el post
                                  req.body.estadios = JSON.parse(req.body.estadios);
                                  for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                    req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                                  }

                                  if(result.estadios.length != 0) {
                                    //Comparo cada estadio que tiene el equipo con todos los que vinieron
                                    //Si alguno no coincide, se elimina
                                    var continuar3 = 0;
                                    for(var i = 0; i < result.estadios.length; i++) {
                                      b = 2;
                                      for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                        if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                                          b = 1;
                                        }
                                      }      
                                      continuar3++;                  
                                      if (b == 2) {
                                        Estadio.findOne({_id: result.estadios[i]._id}).
                                        populate('equipo').
                                        exec((err, es) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else if (es != null) {
                                            var removed = result.estadios.splice(i, 1);
                                            es.equipo = null;
                                            es.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else {
                                                result.save((err) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else if (continuar3 == result.estadios.length) {   
                                                    
                                                    var continuar4 = 0;
                                                    for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                                      b = 2;
                                                      for(var w = 0; w < result.estadios.length; w++) {
                                                        if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                                          b = 1;
                                                        }
                                                      }
                                                      continuar4++;
                                                      if (b == 2) {
                                                        Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                        populate('equipo').
                                                        exec((err, es) => {
                                                          if(err) {
                                                            res.send(err);
                                                          }
                                                          else if (es != null) {
                                                            result.estadios.push(es._id);
                                                            es.equipo = result._id;
                                                            es.save((err) => {
                                                              if(err) {
                                                                res.send(err);
                                                              }
                                                              else {
                                                                result.save((err) => {
                                                                  if(err) {
                                                                    res.send(err);
                                                                  }
                                                                  else if (continuar4 == req.body.estadios.estadios.length) {
                                                                    res.send("Equipo modificado con éxito (estadios y torneos");
                                                                  }
                                                                });
                                                              }
                                                            });                                            
                                                          }
                                                          else {
                                                            res.send("Algún estadio que eligió no existe");
                                                          }
                                                        });
                                                      }
                                                      else if(continuar4 == req.body.estadios.estadios.length) {
                                                        res.send("Equipo modificado con éxito (estadios y torneos");
                                                      }
                                                    }
                                                  }
                                                });
                                              }
                                            });
                                          }
                                          else {
                                            res.send("Algún estadio que eligió no existe");
                                          }
                                        });
                                      }
                                      else if (cotinuar3 == result.estadios.length) {
                                        var continuar4 = 0;
                                        for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                          b = 2;
                                          for(var w = 0; w < result.estadios.length; w++) {
                                            if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                              b = 1;
                                            }
                                          }
                                          continuar4++;
                                          if (b == 2) {
                                            Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                            populate('equipo').
                                            exec((err, es) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else if (es != null) {
                                                result.estadios.push(es._id);
                                                es.equipo = result._id;
                                                es.save((err) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else {
                                                    result.save((err) => {
                                                      if(err) {
                                                        res.send(err);
                                                      }
                                                      else if (continuar4 == req.body.estadios.estadios.length) {
                                                        res.send("Equipo modificado con éxito (estadios y torneos");
                                                      }
                                                    });
                                                  }
                                                });                                            
                                              }
                                              else {
                                                res.send("Algún estadio que eligió no existe");
                                              }
                                            });
                                          }
                                          else if(continuar4 == req.body.estadios.estadios.length) {
                                            res.send("Equipo modificado con éxito (estadios y torneos");
                                          }
                                        }
                                      }
                                    }
                                  }
                                  else {
                                    //Como no tengo estadios aun, agrego todos los que vinieron
                                    var continuar6 = 0;
                                    for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                      continuar6++;
                                      Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                      populate('equipo').
                                      exec((err, es) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if (es != null) {
                                          result.estadios.push(es._id);
                                          es.equipo = result._id;
                                          es.save((err) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else {
                                              result.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else if (continuar6 == req.body.estadios.estadios.length) {
                                                  res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                                }
                                              });
                                            }
                                          });
                                        }
                                        else {
                                          res.send("Algún torneo que eligió no existe");
                                        }
                                      });
                                    }
                                  }
                                }
                                else {
                                  //caso en que hay que borrar todos los estadios
                                  var continuar7 = 0;
                                  Estadio.find().
                                  populate('equipo').
                                  exec((err, es) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else if (es.length != 0) {
                                      for(var j = 0; j < es.length; j++) {    
                                        continuar7++;                                                
                                        if(es[j].equipo._id == result._id) {
                                          es[j].equipo = null;                                                      
                                          es.save((err) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else {
                                              for(var k = 0; k < result.estadios.length; k++) {
                                                if(result.estadios[k]._id == es._id) {
                                                  var removed = result.estadios.splice(k, 1);
                                                  result.save((err) => {
                                                    if(err) {
                                                      res.send(err);
                                                    }
                                                    else if (continuar7 == es.length) {
                                                      res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                                    }
                                                  }); 
                                                }                                                            
                                              }
                                            }                                                        
                                          });
                                        }
                                        else if (continuar7 == es.length) {
                                          res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                        }                                                    
                                      }                                                  
                                    }
                                    else {
                                      console.log("No hay ningun estadio creado aún. No debería pasar esto");
                                    }
                                  });
                                }                                            
                              }
                            }
                          }
                          else {
                            continuar1++;
                          }
                        }
                      });
                    }
                    
                  });
                }
                else {
                  res.send("Algún torneo que eligió no existe");
                }
              });
            }
            else if(continuar1 == result.torneos.length) {
              //Si la última iteración del loop:

              //Comparo cada torneo que vino con todos los torneos existentes
              //y agrego los que se desean (los que vinieron en el post y no están actualmente)
              var continuar2 = 0;
              for(var i = 0; i < req.body.torneos.torneos.length; i++) {
                a = 2;
                for(var w = 0; w < result.torneos.length; w++) {
                  if (result.torneos[w]._id == req.body.torneos.torneos[i]) {
                    a = 1;
                  }
                }
                continuar2++;
                if (a == 2) {
                  //Agrego este torneo (en Torneo.equipos y en Equipo.torneos)
                  Torneo.findOne({_id: req.body.torneos.torneos[i]}).
                  populate('equipos').
                  exec((err, to) => {
                    if(err) {
                      res.send(err);
                    }
                    else if (to != null) {
                      result.torneos.push(to._id);
                      to.equipos.push(result._id);
                      to.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          result.save((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else if(continuar2 == req.body.torneos.torneos.length) {
                              if (req.body.estadios) {
                                //Vinieron estadios en el post
                                req.body.estadios = JSON.parse(req.body.estadios);
                                for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                  req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                                }

                                if(result.estadios.length != 0) {
                                  //Comparo cada estadio que tiene el equipo con todos los que vinieron
                                  //Si alguno no coincide, se elimina
                                  var continuar3 = 0;
                                  for(var i = 0; i < result.estadios.length; i++) {
                                    b = 2;
                                    for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                      if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                                        b = 1;
                                      }
                                    }      
                                    continuar3++;                  
                                    if (b == 2) {
                                      Estadio.findOne({_id: result.estadios[i]._id}).
                                      populate('equipo').
                                      exec((err, es) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if (es != null) {
                                          var removed = result.estadios.splice(i, 1);
                                          es.equipo = null;
                                          es.save((err) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else {
                                              result.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else if (continuar3 == result.estadios.length) {   
                                                  
                                                  var continuar4 = 0;
                                                  for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                                    b = 2;
                                                    for(var w = 0; w < result.estadios.length; w++) {
                                                      if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                                        b = 1;
                                                      }
                                                    }
                                                    continuar4++;
                                                    if (b == 2) {
                                                      Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                      populate('equipo').
                                                      exec((err, es) => {
                                                        if(err) {
                                                          res.send(err);
                                                        }
                                                        else if (es != null) {
                                                          result.estadios.push(es._id);
                                                          es.equipo = result._id;
                                                          es.save((err) => {
                                                            if(err) {
                                                              res.send(err);
                                                            }
                                                            else {
                                                              result.save((err) => {
                                                                if(err) {
                                                                  res.send(err);
                                                                }
                                                                else if (continuar4 == req.body.estadios.estadios.length) {
                                                                  res.send("Equipo modificado con éxito (estadios y torneos");
                                                                }
                                                              });
                                                            }
                                                          });                                            
                                                        }
                                                        else {
                                                          res.send("Algún estadio que eligió no existe");
                                                        }
                                                      });
                                                    }
                                                    else if(continuar4 == req.body.estadios.estadios.length) {
                                                      res.send("Equipo modificado con éxito (estadios y torneos");
                                                    }
                                                  }
                                                }
                                              });
                                            }
                                          });
                                        }
                                        else {
                                          res.send("Algún estadio que eligió no existe");
                                        }
                                      });
                                    }
                                    else if (cotinuar3 == result.estadios.length) {
                                      var continuar4 = 0;
                                      for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                        b = 2;
                                        for(var w = 0; w < result.estadios.length; w++) {
                                          if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                            b = 1;
                                          }
                                        }
                                        continuar4++;
                                        if (b == 2) {
                                          Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                          populate('equipo').
                                          exec((err, es) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else if (es != null) {
                                              result.estadios.push(es._id);
                                              es.equipo = result._id;
                                              es.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else {
                                                  result.save((err) => {
                                                    if(err) {
                                                      res.send(err);
                                                    }
                                                    else if (continuar4 == req.body.estadios.estadios.length) {
                                                      res.send("Equipo modificado con éxito (estadios y torneos");
                                                    }
                                                  });
                                                }
                                              });                                            
                                            }
                                            else {
                                              res.send("Algún estadio que eligió no existe");
                                            }
                                          });
                                        }
                                        else if(continuar4 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (estadios y torneos");
                                        }
                                      }
                                    }
                                  }
                                }
                                else {
                                  //Como no tengo estadios aun, agrego todos los que vinieron
                                  var continuar6 = 0;
                                  for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                    continuar6++;
                                    Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                    populate('equipo').
                                    exec((err, es) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else if (es != null) {
                                        result.estadios.push(es._id);
                                        es.equipo = result._id;
                                        es.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else {
                                            result.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else if (continuar6 == req.body.estadios.estadios.length) {
                                                res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                              }
                                            });
                                          }
                                        });
                                      }
                                      else {
                                        res.send("Algún torneo que eligió no existe");
                                      }
                                    });
                                  }
                                }
                              }
                              else {
                                //caso en que hay que borrar todos los estadios
                                var continuar7 = 0;
                                Estadio.find().
                                populate('equipo').
                                exec((err, es) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else if (es.length != 0) {
                                    for(var j = 0; j < es.length; j++) {    
                                      continuar7++;                                                
                                      if(es[j].equipo._id == result._id) {
                                        es[j].equipo = null;                                                      
                                        es.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else {
                                            for(var k = 0; k < result.estadios.length; k++) {
                                              if(result.estadios[k]._id == es._id) {
                                                var removed = result.estadios.splice(k, 1);
                                                result.save((err) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else if (continuar7 == es.length) {
                                                    res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                                  }
                                                }); 
                                              }                                                            
                                            }
                                          }                                                        
                                        });
                                      }
                                      else if (continuar7 == es.length) {
                                        res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                      }                                                    
                                    }                                                  
                                  }
                                  else {
                                    console.log("No hay ningun estadio creado aún. No debería pasar esto");
                                  }
                                });
                              }                                            
                            }
                          });
                        }
                      });
                    }
                    else {
                      res.send("Algún torneo que eligió no existe");
                    }
                  });
                }
                else if(continuar2 == req.body.torneos.torneos.length) {
                  if (req.body.estadios) {
                    //Vinieron estadios en el post
                    req.body.estadios = JSON.parse(req.body.estadios);
                    for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                      req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                    }

                    if(result.estadios.length != 0) {
                      //Comparo cada estadio que tiene el equipo con todos los que vinieron
                      //Si alguno no coincide, se elimina
                      var continuar3 = 0;
                      for(var i = 0; i < result.estadios.length; i++) {
                        b = 2;
                        for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                          if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                            b = 1;
                          }
                        }      
                        continuar3++;                  
                        if (b == 2) {
                          Estadio.findOne({_id: result.estadios[i]._id}).
                          populate('equipo').
                          exec((err, es) => {
                            if(err) {
                              res.send(err);
                            }
                            else if (es != null) {
                              var removed = result.estadios.splice(i, 1);
                              es.equipo = null;
                              es.save((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  result.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else if (continuar3 == result.estadios.length) {   
                                      
                                      var continuar4 = 0;
                                      for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                        b = 2;
                                        for(var w = 0; w < result.estadios.length; w++) {
                                          if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                            b = 1;
                                          }
                                        }
                                        continuar4++;
                                        if (b == 2) {
                                          Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                          populate('equipo').
                                          exec((err, es) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else if (es != null) {
                                              result.estadios.push(es._id);
                                              es.equipo = result._id;
                                              es.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else {
                                                  result.save((err) => {
                                                    if(err) {
                                                      res.send(err);
                                                    }
                                                    else if (continuar4 == req.body.estadios.estadios.length) {
                                                      res.send("Equipo modificado con éxito (estadios y torneos");
                                                    }
                                                  });
                                                }
                                              });                                            
                                            }
                                            else {
                                              res.send("Algún estadio que eligió no existe");
                                            }
                                          });
                                        }
                                        else if(continuar4 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (estadios y torneos");
                                        }
                                      }
                                    }
                                  });
                                }
                              });
                            }
                            else {
                              res.send("Algún estadio que eligió no existe");
                            }
                          });
                        }
                        else if (cotinuar3 == result.estadios.length) {
                          var continuar4 = 0;
                          for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                            b = 2;
                            for(var w = 0; w < result.estadios.length; w++) {
                              if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                b = 1;
                              }
                            }
                            continuar4++;
                            if (b == 2) {
                              Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                              populate('equipo').
                              exec((err, es) => {
                                if(err) {
                                  res.send(err);
                                }
                                else if (es != null) {
                                  result.estadios.push(es._id);
                                  es.equipo = result._id;
                                  es.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      result.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if (continuar4 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (estadios y torneos");
                                        }
                                      });
                                    }
                                  });                                            
                                }
                                else {
                                  res.send("Algún estadio que eligió no existe");
                                }
                              });
                            }
                            else if(continuar4 == req.body.estadios.estadios.length) {
                              res.send("Equipo modificado con éxito (estadios y torneos");
                            }
                          }
                        }
                      }
                    }
                    else {
                      //Como no tengo estadios aun, agrego todos los que vinieron
                      var continuar6 = 0;
                      for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                        continuar6++;
                        Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                        populate('equipo').
                        exec((err, es) => {
                          if(err) {
                            res.send(err);
                          }
                          else if (es != null) {
                            result.estadios.push(es._id);
                            es.equipo = result._id;
                            es.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                result.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else if (continuar6 == req.body.estadios.estadios.length) {
                                    res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                  }
                                });
                              }
                            });
                          }
                          else {
                            res.send("Algún torneo que eligió no existe");
                          }
                        });
                      }
                    }
                  }
                  else {
                    //caso en que hay que borrar todos los estadios
                    var continuar7 = 0;
                    Estadio.find().
                    populate('equipo').
                    exec((err, es) => {
                      if(err) {
                        res.send(err);
                      }
                      else if (es.length != 0) {
                        for(var j = 0; j < es.length; j++) {    
                          continuar7++;                                                
                          if(es[j].equipo._id == result._id) {
                            es[j].equipo = null;                                                      
                            es.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                for(var k = 0; k < result.estadios.length; k++) {
                                  if(result.estadios[k]._id == es._id) {
                                    var removed = result.estadios.splice(k, 1);
                                    result.save((err) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else if (continuar7 == es.length) {
                                        res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                      }
                                    }); 
                                  }                                                            
                                }
                              }                                                        
                            });
                          }
                          else if (continuar7 == es.length) {
                            res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                          }                                                    
                        }                                                  
                      }
                      else {
                        console.log("No hay ningun estadio creado aún. No debería pasar esto");
                      }
                    });
                  }                                            
                }
              }
            }
            else {
              continuar1++;
            }
          }
        }
        else {
          //Como no tengo torneos aun, agrego todos los que vinieron
          var continuar8 = 1;
          for(var i = 0; i < req.body.torneos.torneos.length; i++) {
            Torneo.findOne({_id: req.body.torneos.torneos[i]}).
            populate('equipos').
            exec((err, to) => {
              if(err) {
                res.send(err);
              }
              else if (to != null) {
                result.torneos.push(to._id);
                to.equipos.push(result._id);
                to.save((err) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    result.save((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else if (continuar8 == req.body.torneos.torneos.length) {
                        if (req.body.estadios) {
                          //Vinieron estadios en el post
                          req.body.estadios = JSON.parse(req.body.estadios);
                          for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                            req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                          }

                          if(result.estadios.length != 0) {
                            //Comparo cada estadio que tiene el equipo con todos los que vinieron
                            //Si alguno no coincide, se elimina
                            var continuar3 = 1;
                            for(var i = 0; i < result.estadios.length; i++) {
                              b = 2;
                              for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                                  b = 1;
                                }
                              }      
                              if (b == 2) {
                                Estadio.findOne({_id: result.estadios[i]._id}).
                                populate('equipo').
                                exec((err, es) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else if (es != null) {
                                    var removed = result.estadios.splice(i, 1);
                                    es.equipo = null;
                                    es.save((err) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else {
                                        result.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else if (continuar3 == result.estadios.length) {   
                                            
                                            var continuar4 = 1;
                                            for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                              b = 2;
                                              for(var w = 0; w < result.estadios.length; w++) {
                                                if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                                  b = 1;
                                                }
                                              }
                                              if (b == 2) {
                                                Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                populate('equipo').
                                                exec((err, es) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else if (es != null) {
                                                    result.estadios.push(es._id);
                                                    es.equipo = result._id;
                                                    es.save((err) => {
                                                      if(err) {
                                                        res.send(err);
                                                      }
                                                      else {
                                                        result.save((err) => {
                                                          if(err) {
                                                            res.send(err);
                                                          }
                                                          else if (continuar4 == req.body.estadios.estadios.length) {
                                                            res.send("Equipo modificado con éxito (estadios y torneos");
                                                          }
                                                          else {
                                                            continuar4++;
                                                          }
                                                        });
                                                      }
                                                    });                                            
                                                  }
                                                  else {
                                                    res.send("Algún estadio que eligió no existe");
                                                  }
                                                });
                                              }
                                              else if(continuar4 == req.body.estadios.estadios.length) {
                                                res.send("Equipo modificado con éxito (estadios y torneos");
                                              }
                                              else {
                                                continuar4++;
                                              }
                                            }
                                          }
                                          else {
                                            continuar3++;
                                          }
                                        });
                                      }
                                    });
                                  }
                                  else {
                                    res.send("Algún estadio que eligió no existe");
                                  }
                                });
                              }
                              else if (cotinuar3 == result.estadios.length) {
                                var continuar4 = 1;
                                for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                  b = 2;
                                  for(var w = 0; w < result.estadios.length; w++) {
                                    if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                      b = 1;
                                    }
                                  }
                                  if (b == 2) {
                                    Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                    populate('equipo').
                                    exec((err, es) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else if (es != null) {
                                        result.estadios.push(es._id);
                                        es.equipo = result._id;
                                        es.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else {
                                            result.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else if (continuar4 == req.body.estadios.estadios.length) {
                                                res.send("Equipo modificado con éxito (estadios y torneos");
                                              }
                                              else {
                                                continuar4++;
                                              }
                                            });
                                          }
                                        });                                            
                                      }
                                      else {
                                        res.send("Algún estadio que eligió no existe");
                                      }
                                    });
                                  }
                                  else if(continuar4 == req.body.estadios.estadios.length) {
                                    res.send("Equipo modificado con éxito (estadios y torneos");
                                  }
                                  else {
                                    continuar4++;
                                  }
                                }
                              }
                              else {
                                continuar3++;
                              }
                            }
                          }
                          else {
                            //Como no tengo estadios aun, agrego todos los que vinieron
                            var continuar6 = 1;
                            for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                              Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                              populate('equipo').
                              exec((err, es) => {
                                if(err) {
                                  res.send(err);
                                }
                                else if (es != null) {
                                  result.estadios.push(es._id);
                                  es.equipo = result._id;
                                  es.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      result.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if (continuar6 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                        }
                                        else {
                                          continuar6++;
                                        }
                                      });
                                    }
                                  });
                                }
                                else {
                                  res.send("Algún torneo que eligió no existe");
                                }
                              });
                            }
                          }
                        }
                        else {
                          //caso en que hay que borrar todos los estadios
                          var continuar7 = 1;
                          Estadio.find().
                          populate('equipo').
                          exec((err, es) => {
                            if(err) {
                              res.send(err);
                            }
                            else if (es.length != 0) {
                              for(var j = 0; j < es.length; j++) {    
                                if(es[j].equipo._id == result._id) {
                                  es[j].equipo = null;                                                      
                                  es.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      for(var k = 0; k < result.estadios.length; k++) {
                                        if(result.estadios[k]._id == es._id) {
                                          var removed = result.estadios.splice(k, 1);
                                          result.save((err) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else if (continuar7 == es.length) {
                                              res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                            }
                                            else {
                                              continuar7++;
                                            }
                                          }); 
                                        }                                                            
                                      }
                                    }                                                        
                                  });
                                }
                                else if (continuar7 == es.length) {
                                  res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                }    
                                else {
                                  continuar7++;
                                }                                                
                              }                                                  
                            }
                            else {
                              console.log("No hay ningun estadio creado aún. No debería pasar esto");
                            }
                          });
                        }
                      }
                      else {
                        continuar8++;
                      }
                    });
                  }
                });
              }
              else {
                res.send("Algún torneo que eligió no existe");
              }
            });
          }
        }
      }
      else if (result.torneos.length != 0) {
        //caso en que hay que borrar todos los torneos si es que habia
        var continuar9 = 1;
        Torneo.find().
        populate('equipos').
        exec((err, to) => {
          if(err) {
            res.send(err);
          }
          else if (to.length != 0) {
            for(var j = 0; j < to.length; j++) {
              for(var k = 0; k < to[j].equipos.length; k++) {
                if(to[j].equipos[k]._id == result._id) {
                  var removed = to[j].equipos.splice(k, 1);
                  to.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      for(var w = 0; w < result.torneos.length; w++) {
                        var removed = result.torneos.splice(w, 1);
                        result.save((err) => {
                          if(err) {
                            res.send(err);
                          }
                          else if (continuar9 == to.length) {
                            if (req.body.estadios) {
                              //Vinieron estadios en el post
                              req.body.estadios = JSON.parse(req.body.estadios);
                              for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                              }

                              if(result.estadios.length != 0) {
                                //Comparo cada estadio que tiene el equipo con todos los que vinieron
                                //Si alguno no coincide, se elimina
                                var continuar3 = 1;
                                for(var i = 0; i < result.estadios.length; i++) {
                                  b = 2;
                                  for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                                    if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                                      b = 1;
                                    }
                                  }      
                                  if (b == 2) {
                                    Estadio.findOne({_id: result.estadios[i]._id}).
                                    populate('equipo').
                                    exec((err, es) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else if (es != null) {
                                        var removed = result.estadios.splice(i, 1);
                                        es.equipo = null;
                                        es.save((err) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else {
                                            result.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else if (continuar3 == result.estadios.length) {   
                                                
                                                var continuar4 = 1;
                                                for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                                  b = 2;
                                                  for(var w = 0; w < result.estadios.length; w++) {
                                                    if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                                      b = 1;
                                                    }
                                                  }
                                                  if (b == 2) {
                                                    Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                                    populate('equipo').
                                                    exec((err, es) => {
                                                      if(err) {
                                                        res.send(err);
                                                      }
                                                      else if (es != null) {
                                                        result.estadios.push(es._id);
                                                        es.equipo = result._id;
                                                        es.save((err) => {
                                                          if(err) {
                                                            res.send(err);
                                                          }
                                                          else {
                                                            result.save((err) => {
                                                              if(err) {
                                                                res.send(err);
                                                              }
                                                              else if (continuar4 == req.body.estadios.estadios.length) {
                                                                res.send("Equipo modificado con éxito (estadios y torneos");
                                                              }
                                                              else {
                                                                continuar4++;
                                                              }
                                                            });
                                                          }
                                                        });                                            
                                                      }
                                                      else {
                                                        res.send("Algún estadio que eligió no existe");
                                                      }
                                                    });
                                                  }
                                                  else if(continuar4 == req.body.estadios.estadios.length) {
                                                    res.send("Equipo modificado con éxito (estadios y torneos");
                                                  }
                                                  else {
                                                    continuar4++;
                                                  }
                                                }
                                              }
                                              else {
                                                continuar3++;
                                              }
                                            });
                                          }
                                        });
                                      }
                                      else {
                                        res.send("Algún estadio que eligió no existe");
                                      }
                                    });
                                  }
                                  else if (cotinuar3 == result.estadios.length) {
                                    var continuar4 = 1;
                                    for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                      b = 2;
                                      for(var w = 0; w < result.estadios.length; w++) {
                                        if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                          b = 1;
                                        }
                                      }
                                      if (b == 2) {
                                        Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                        populate('equipo').
                                        exec((err, es) => {
                                          if(err) {
                                            res.send(err);
                                          }
                                          else if (es != null) {
                                            result.estadios.push(es._id);
                                            es.equipo = result._id;
                                            es.save((err) => {
                                              if(err) {
                                                res.send(err);
                                              }
                                              else {
                                                result.save((err) => {
                                                  if(err) {
                                                    res.send(err);
                                                  }
                                                  else if (continuar4 == req.body.estadios.estadios.length) {
                                                    res.send("Equipo modificado con éxito (estadios y torneos");
                                                  }
                                                  else {
                                                    continuar4++;
                                                  }
                                                });
                                              }
                                            });                                            
                                          }
                                          else {
                                            res.send("Algún estadio que eligió no existe");
                                          }
                                        });
                                      }
                                      else if(continuar4 == req.body.estadios.estadios.length) {
                                        res.send("Equipo modificado con éxito (estadios y torneos");
                                      }
                                      else {
                                        continuar4++;
                                      }
                                    }
                                  }
                                  else {
                                    continuar3++;
                                  }
                                }
                              }
                              else {
                                //Como no tengo estadios aun, agrego todos los que vinieron
                                var continuar6 = 1;
                                for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                  Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                  populate('equipo').
                                  exec((err, es) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else if (es != null) {
                                      result.estadios.push(es._id);
                                      es.equipo = result._id;
                                      es.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else {
                                          result.save((err) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else if (continuar6 == req.body.estadios.estadios.length) {
                                              res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                            }
                                            else {
                                              continuar6++;
                                            }
                                          });
                                        }
                                      });
                                    }
                                    else {
                                      res.send("Algún torneo que eligió no existe");
                                    }
                                  });
                                }
                              }
                            }
                            else if(result.estadios.length != 0) {
                              //caso en que hay que borrar todos los estadios si es que habia
                              var continuar7 = 1;
                              Estadio.find().
                              populate('equipo').
                              exec((err, es) => {
                                if(err) {
                                  res.send(err);
                                }
                                else if (es.length != 0) {
                                  for(var j = 0; j < es.length; j++) {    
                                    if(es[j].equipo._id == result._id) {
                                      es[j].equipo = null;                                                      
                                      es.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else {
                                          for(var k = 0; k < result.estadios.length; k++) {
                                            if(result.estadios[k]._id == es._id) {
                                              var removed = result.estadios.splice(k, 1);
                                              result.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else if (continuar7 == es.length) {
                                                  res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                                }
                                                else {
                                                  continuar7++;
                                                }
                                              }); 
                                            }                                                            
                                          }
                                        }                                                        
                                      });
                                    }
                                    else if (continuar7 == es.length) {
                                      res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                    }
                                    else {
                                      continuar7++;
                                    }                                                    
                                  }                                                  
                                }
                                else {
                                  console.log("No hay ningun estadio creado aún. No debería pasar esto");
                                }
                              });
                            }
                            else {
                              res.send("Equipo modificado. Habia torneos y se borraron todos. No habia estadios, por ende quedó vacio");
                            }
                          }
                          else {
                            continuar9++;
                          }
                        }); 
                      }
                    }
                  });
                }
                else if (continuar9 == to.length) {
                  if (req.body.estadios) {
                    //Vinieron estadios en el post
                    req.body.estadios = JSON.parse(req.body.estadios);
                    for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                      req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
                    }

                    if(result.estadios.length != 0) {
                      //Comparo cada estadio que tiene el equipo con todos los que vinieron
                      //Si alguno no coincide, se elimina
                      var continuar3 = 1;
                      for(var i = 0; i < result.estadios.length; i++) {
                        b = 2;
                        for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                          if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                            b = 1;
                          }
                        }      
                        if (b == 2) {
                          Estadio.findOne({_id: result.estadios[i]._id}).
                          populate('equipo').
                          exec((err, es) => {
                            if(err) {
                              res.send(err);
                            }
                            else if (es != null) {
                              var removed = result.estadios.splice(i, 1);
                              es.equipo = null;
                              es.save((err) => {
                                if(err) {
                                  res.send(err);
                                }
                                else {
                                  result.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else if (continuar3 == result.estadios.length) {   
                                      
                                      var continuar4 = 1;
                                      for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                                        b = 2;
                                        for(var w = 0; w < result.estadios.length; w++) {
                                          if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                            b = 1;
                                          }
                                        }
                                        if (b == 2) {
                                          Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                                          populate('equipo').
                                          exec((err, es) => {
                                            if(err) {
                                              res.send(err);
                                            }
                                            else if (es != null) {
                                              result.estadios.push(es._id);
                                              es.equipo = result._id;
                                              es.save((err) => {
                                                if(err) {
                                                  res.send(err);
                                                }
                                                else {
                                                  result.save((err) => {
                                                    if(err) {
                                                      res.send(err);
                                                    }
                                                    else if (continuar4 == req.body.estadios.estadios.length) {
                                                      res.send("Equipo modificado con éxito (estadios y torneos");
                                                    }
                                                    else {
                                                      continuar4++;
                                                    }
                                                  });
                                                }
                                              });                                            
                                            }
                                            else {
                                              res.send("Algún estadio que eligió no existe");
                                            }
                                          });
                                        }
                                        else if(continuar4 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (estadios y torneos");
                                        }
                                        else {
                                          continuar4++;
                                        }
                                      }
                                    }
                                    else {
                                      continuar3++;
                                    }
                                  });
                                }
                              });
                            }
                            else {
                              res.send("Algún estadio que eligió no existe");
                            }
                          });
                        }
                        else if (cotinuar3 == result.estadios.length) {
                          var continuar4 = 1;
                          for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                            b = 2;
                            for(var w = 0; w < result.estadios.length; w++) {
                              if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                b = 1;
                              }
                            }
                            if (b == 2) {
                              Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                              populate('equipo').
                              exec((err, es) => {
                                if(err) {
                                  res.send(err);
                                }
                                else if (es != null) {
                                  result.estadios.push(es._id);
                                  es.equipo = result._id;
                                  es.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      result.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if (continuar4 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (estadios y torneos");
                                        }
                                        else {
                                          continuar4++;
                                        }
                                      });
                                    }
                                  });                                            
                                }
                                else {
                                  res.send("Algún estadio que eligió no existe");
                                }
                              });
                            }
                            else if(continuar4 == req.body.estadios.estadios.length) {
                              res.send("Equipo modificado con éxito (estadios y torneos");
                            }
                            else {
                              continuar4++;
                            }
                          }
                        }
                        else {
                          continuar3++;
                        }
                      }
                    }
                    else {
                      //Como no tengo estadios aun, agrego todos los que vinieron
                      var continuar6 = 1;
                      for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                        Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                        populate('equipo').
                        exec((err, es) => {
                          if(err) {
                            res.send(err);
                          }
                          else if (es != null) {
                            result.estadios.push(es._id);
                            es.equipo = result._id;
                            es.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                result.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else if (continuar6 == req.body.estadios.estadios.length) {
                                    res.send("Equipo modificado con éxito (todos estadios nuevos, y algún cambio de torneos");
                                  }
                                  else {
                                    continuar6++;
                                  }
                                });
                              }
                            });
                          }
                          else {
                            res.send("Algún torneo que eligió no existe");
                          }
                        });
                      }
                    }
                  }
                  else if(result.estadios.length != 0) {
                    //caso en que hay que borrar todos los estadios
                    var continuar7 = 1;
                    Estadio.find().
                    populate('equipo').
                    exec((err, es) => {
                      if(err) {
                        res.send(err);
                      }
                      else if (es.length != 0) {
                        for(var j = 0; j < es.length; j++) {    
                          if(es[j].equipo._id == result._id) {
                            es[j].equipo = null;                                                      
                            es.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                for(var k = 0; k < result.estadios.length; k++) {
                                  if(result.estadios[k]._id == es._id) {
                                    var removed = result.estadios.splice(k, 1);
                                    result.save((err) => {
                                      if(err) {
                                        res.send(err);
                                      }
                                      else if (continuar7 == es.length) {
                                        res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                                      }
                                      else {
                                        continuar7++;
                                      }
                                    }); 
                                  }                                                            
                                }
                              }                                                        
                            });
                          }
                          else if (continuar7 == es.length) {
                            res.send("Equipo modificado con éxito (todos los estadios borrados, y cambios en torneos");
                          }     
                          else {
                            continuar7++;
                          }                                               
                        }                                                  
                      }
                      else {
                        console.log("No hay ningun estadio creado aún. No debería pasar esto");
                      }
                    });
                  }
                  else {
                    res.send("Equipo modificado correctamente, no tenia estadios y no se agregaron")
                  }
                }
                else {
                  continuar9++;
                } 
              }
            }            
          }
          else {
            console.log("No hay ningun torneo creado aún. No debería pasar esto");
          }
        });
      }
      else if (req.body.estadios) {
        //Vinieron estadios en el post
        req.body.estadios = JSON.parse(req.body.estadios);
        for(var w = 0; w < req.body.estadios.estadios.length; w++) {
          req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
        }

        if(result.estadios.length != 0) {
          //Comparo cada estadio que tiene el equipo con todos los que vinieron
          //Si alguno no coincide, se elimina
          var continuar3 = 1;
          for(var i = 0; i < result.estadios.length; i++) {
            b = 2;
            for(var w = 0; w < req.body.estadios.estadios.length; w++) {
              if (result.estadios[i]._id == req.body.estadios.estadios[w]) {
                b = 1;
              }
            }      
            if (b == 2) {
              Estadio.findOne({_id: result.estadios[i]._id}).
              populate('equipo').
              exec((err, es) => {
                if(err) {
                  res.send(err);
                }
                else if (es != null) {
                  var removed = result.estadios.splice(i, 1);
                  es.equipo = null;
                  es.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      result.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else if (continuar3 == result.estadios.length) {   
                          
                          var continuar4 = 1;
                          for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                            b = 2;
                            for(var w = 0; w < result.estadios.length; w++) {
                              if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                                b = 1;
                              }
                            }
                            if (b == 2) {
                              Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                              populate('equipo').
                              exec((err, es) => {
                                if(err) {
                                  res.send(err);
                                }
                                else if (es != null) {
                                  result.estadios.push(es._id);
                                  es.equipo = result._id;
                                  es.save((err) => {
                                    if(err) {
                                      res.send(err);
                                    }
                                    else {
                                      result.save((err) => {
                                        if(err) {
                                          res.send(err);
                                        }
                                        else if (continuar4 == req.body.estadios.estadios.length) {
                                          res.send("Equipo modificado con éxito (estadios y torneos");
                                        }
                                        else {
                                          continuar4++;
                                        }
                                      });
                                    }
                                  });                                            
                                }
                                else {
                                  res.send("Algún estadio que eligió no existe");
                                }
                              });
                            }
                            else if(continuar4 == req.body.estadios.estadios.length) {
                              res.send("Equipo modificado con éxito (estadios y torneos");
                            }
                            else {
                              continuar4++;
                            }
                          }
                        }
                        else {
                          continuar3++;
                        }
                      });
                    }
                  });
                }
                else {
                  res.send("Algún estadio que eligió no existe");
                }
              });
            }
            else if (cotinuar3 == result.estadios.length) {
              var continuar4 = 1;
              for(var i = 0; i < req.body.estadios.estadios.length; i++) {
                b = 2;
                for(var w = 0; w < result.estadios.length; w++) {
                  if (result.estadios[w]._id == req.body.estadios.estadios[i]) {
                    b = 1;
                  }
                }
                if (b == 2) {
                  Estadio.findOne({_id: req.body.estadios.estadios[i]}).
                  populate('equipo').
                  exec((err, es) => {
                    if(err) {
                      res.send(err);
                    }
                    else if (es != null) {
                      result.estadios.push(es._id);
                      es.equipo = result._id;
                      es.save((err) => {
                        if(err) {
                          res.send(err);
                        }
                        else {
                          result.save((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else if (continuar4 == req.body.estadios.estadios.length) {
                              res.send("Equipo modificado con éxito (estadios y torneos");
                            }
                            else {
                              continuar4++;
                            }
                          });
                        }
                      });                                            
                    }
                    else {
                      res.send("Algún estadio que eligió no existe");
                    }
                  });
                }
                else if(continuar4 == req.body.estadios.estadios.length) {
                  res.send("Equipo modificado con éxito (estadios y torneos");
                }
                else {
                  continuar4++;
                }
              }
            }
            else {
              continuar3++;
            }
          }
        }
        else {
          //Como no tengo estadios aun, agrego todos los que vinieron
          var continuar6 = 1;
          for(var i = 0; i < req.body.estadios.estadios.length; i++) {
            Estadio.findOne({_id: req.body.estadios.estadios[i]}).
            populate('equipo').
            exec((err, es) => {
              if(err) {
                res.send(err);
              }
              else if (es != null) {
                console.log(result.estadios)
                result.estadios.push(es._id);
                es.equipo = result._id;
                es.save((err) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    console.log(result.estadios)
                    result.save((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else if (continuar6 == req.body.estadios.estadios.length) {
                        res.send("Equipo modificado con éxito (todos estadios nuevos y no habia ni se agregaron torneos");
                      }
                      else {
                        continuar6++;
                      }
                    });
                  }
                });
              }
              else {
                res.send("Algún estadio que eligió no existe");
              }
            });
          }
        }
      }
      else if(result.estadios.length != 0) {
        //caso en que hay que borrar todos los estadios
        var continuar7 = 1;
        Estadio.find().
        populate('equipo').
        exec((err, es) => {
          if(err) {
            res.send(err);
          }
          else if (es.length != 0) {
            console.log(es);
            for(var j = 0; j < es.length; j++) { 
              if(es[j].equipo != null) {  
                var e = es[j];    
                console.log(e)     
                if(e.equipo._id.equals(result._id)) {
                  e.equipo = null; 
                  e.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      console.log("Entro")
                      console.log(result)
                      console.log(result.estadios.length)
                      for(var k = 0; k < result.estadios.length; k++) {
                        console.log(k)
                        console.log(result.estadios[k]._id)
                        console.log(e._id)
                        if(result.estadios[k]._id.equals(e._id)) {
                          var removed = result.estadios.splice(k, 1);
                          result.save((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else if (continuar7 == es.length) {
                              res.send("Equipo modificado con éxito (todos los estadios borrados y no habia ni se modificaron torneos)");
                            }
                            else {
                              console.log(j + "modificado");
                            }
                          }); 
                        }                                                            
                      }
                      continuar7++;
                    }                                                        
                  });
                }
                else if (continuar7 == es.length) {
                  res.send("Equipo modificado con éxito (todos los estadios borrados y no habia torneos ni se tocaron");
                }     
                else {
                  console.log(j + "no estaba este estadio");
                  continuar7++;
                }  
              }
              else if (continuar7 == es.length) {
                res.send("Equipo modificado con éxito (todos los estadios borrados y no habia torneos ni se tocaron)");
              }     
              else {
                console.log(j + "era null")
                continuar7++;
              }                                             
            }                                                  
          }
          else {
            console.log("No hay ningun estadio creado aún. No debería pasar esto");
          }
        });
      }
      else {
        result.save((err) => {
          if(err) {
            res.send(err);
          }
          else {
            res.send("Equipo modificado correctamente. No tenia torneos ni estadios y no se le agregaron");
          }
        });
      }      
    }
    else {
      res.send("El equipo que quiere modificar no existe");
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
      if(result.torneo == null && result.estadio == null && result.jugadores.length == 0) {
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
                res.send("No se puede borrar el equipo porque se utiliza en un evento de algun partido");
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
                        res.send("No se puede borrar el equipo porque se utiliza en un partido");
                      }
                      else if (continuar2 == partidos.length) {
                        result.remove((err) => {
                          if(err) {
                            res.send(err);
                          }
                          else {
                            res.send("Equipo eliminado correctamente");
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
                    res.send("No se puede borrar el equipo porque se utiliza en un partido");
                  }
                  else if (continuar2 == partidos.length) {
                    result.remove((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else {
                        res.send("Equipo eliminado correctamente");
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
                    res.send("Equipo eliminado correctamente");
                  }
                });
              }                  
            });
          }
        });
      }
      else {
        res.send("No se puede borrar el equipo porque pertenece a un torneo/estadio/jugador");
      }
    } 
    else {
      res.send("El equipo no existe");
    }   
  });
});
      

module.exports=router;
