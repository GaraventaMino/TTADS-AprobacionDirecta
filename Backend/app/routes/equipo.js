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
  populate('estadios').
  populate('torneos').
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
    path: 'estadios',
    select: 'nombre direccion'
  }).  
  populate({
    path: 'torneos',
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
  if(req.body.estadios) {
    var continuar1 = 1;
    let estadiosNuevo=[];

    req.body.estadios = JSON.parse(req.body.estadios);
    for(var w = 0; w < req.body.estadios.estadios.length; w++) {
      req.body.estadios.estadios[w] = mongoose.Types.ObjectId(req.body.estadios.estadios[w]);
    }

    for(var w = 0; w < req.body.estadios.estadios.length; w++) {    
      Estadio.findOne({_id: req.body.estadios.estadios[w]}, (error, estad) => {
        if (error) {
          res.send(error);
        }
        else if (estad != null) {
          if(estad.equipo == null) {
            res.send("Algún estadio de los que se eligieron, ya pertenece a un equipo");
          }
          else {            
            estadiosNuevo.push(estad._id);
            if(continuar1 == req.body.estadios.estadios.length) {
              if(req.body.torneos) {
                //Se agregan torneos y estadios                
                var continuar = 1;
                let torneosNuevo=[];

                if(typeof(req.body.torneos) != 'object') {
                  req.body.torneos = JSON.parse(req.body.torneos);
                }
                
                for(var w = 0; w < req.body.torneos.torneos.length; w++) {
                  req.body.torneos.torneos[w] = mongoose.Types.ObjectId(req.body.torneos.torneos[w]);
                }
                for(var w = 0; w < req.body.torneos.torneos.length; w++) {
                  Torneo.findOne({_id: req.body.torneos.torneos[w]}, (error, torn) => {
                    if (error) {
                      res.send(error);
                    }
                    else if (torn != null) {
                      torneosNuevo.push(torn._id);
                      if(continuar == req.body.torneos.torneos.length) {
                        var equipoNuevo = new Equipo({
                          nombre: nombreNuevo,
                          tecnico: tecnicoNuevo,
                          estadios: estadiosNuevo,
                          escudo: escudoNuevo,
                          torneos: torneosNuevo
                        });
                        equipoNuevo.save((err, equipoGuardado) => {
                          if(err){
                            res.send(err);
                          }
                          else {
                            var cont = 1;
                            for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                              Estadio.findOne({_id: req.body.estadios.estadios[w]}, (error, estad) => {
                                if (error) {
                                  res.send(error);
                                }
                                else if (estad != null) {
                                  estad.equipo = equipoGuardado._id;
                                  estad.save((err, correcto) => {
                                    if(err){
                                      res.send(err);
                                    }
                                    else if (cont == req.body.estadios.estadios.length) {
                                      var cont2 = 1;
                                      for(var w = 0; w < req.body.torneos.torneos.length; w++) {                                        
                                        Torneo.findOne({_id: req.body.torneos.torneos[w]}, (error, torn) => {
                                          if (error) {
                                            res.send(error);
                                          }
                                          else if (torn != null) {
                                            torn.equipos.push(equipoGuardado._id);
                                            torn.save((err, correcto) => {
                                              if(err){
                                                res.send(err);
                                              }
                                              else if(cont2 == req.body.torneos.torneos.length) {
                                                res.send("Equipo creado correctamente con estadios y torneos");
                                              }
                                              else {
                                                cont2++;
                                              }
                                            });
                                          }
                                        });
                                      }
                                    }
                                    else {
                                      cont++;
                                    }
                                  });
                                }
                              });
                            }
                          }
                        });
                      }
                      else {
                        continuar++;
                      }
                    }
                    else {
                      res.send("Algún torneo seleccionado no existe");
                    }
                  });
                }
              }
              else {
                //Solo se le agregan estadios pero no torneos
                var equipoNuevo = new Equipo({
                  nombre: nombreNuevo,
                  tecnico: tecnicoNuevo,
                  estadios: estadiosNuevo,
                  escudo: escudoNuevo
                });
                equipoNuevo.save((err, equipoGuardado) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    var cont3 = 1;
                    for(var w = 0; w < req.body.estadios.estadios.length; w++) {
                      Estadio.findOne({_id: req.body.estadios.estadios[w]}, (error, estad) => {
                        if (error) {
                          res.send(error);
                        }
                        else if (estad != null) {
                          estad.equipo = equipoGuardado._id;
                          estad.save((err, correcto) => {
                            if(err){
                              res.send(err);
                            }
                            else if (cont3 == req.body.estadios.estadios.length) {
                              res.send("Equipo creado correctamente con estadios pero sin torneos");
                            }
                            else {
                              cont3++;
                            }
                          });
                        }
                        else {
                          res.send("Alguno de los estadios que se ingresaron, no existen");
                        }
                      });
                    }
                  }
                });
              }
            }
            else {
              continuar1++;
            }
          }
        }
        else {
          res.send("Algún estadio seleccionado no existe");
        }
      });
    }
  }
  else if(req.body.torneos) {
    //Se agregan torneos pero no estadios
    var continuar = 1;
    let torneosNuevo=[];
    req.body.torneos = JSON.parse(req.body.torneos);
    for(var w = 0; w < req.body.torneos.torneos.length; w++) {
      req.body.torneos.torneos[w] = mongoose.Types.ObjectId(req.body.torneos.torneos[w]);
    }

    for(var w = 0; w < req.body.torneos.torneos.length; w++) {
      Torneo.findOne({_id: req.body.torneos.torneos[w]}, (error, torn) => {
        if (error) {
          res.send(error);
        }
        else if (torn != null) {
          torneosNuevo.push(torn._id);
          if(continuar == req.body.torneos.torneos.length) {
            var equipoNuevo = new Equipo({
              nombre: nombreNuevo,
              tecnico: tecnicoNuevo,
              escudo: escudoNuevo,
              torneos: torneosNuevo
            });
            equipoNuevo.save((err, equipoGuardado) => {
              if(err){
                res.send(err);
              }
              else {
                for(var k = 0; k < req.body.torneos.torneos.length; k++) {
                  Torneo.findOne({_id: req.body.torneos.torneos[k]}, (error, torn) => {
                    if (error) {
                      res.send(error);
                    }
                    else if (torn != null) {
                      torn.equipos.push(equipoGuardado._id);
                      torn.save((err, correcto) => {
                        if(err){
                          res.send(err);
                        }
                      });
                    }
                  });
                }
                res.send("Equipo creado correctamente con torneos pero sin estadios");
              }
            });
          }
          else {
            continuar++;
          }
        }
        else {
          res.send("Algún torneo seleccionado no existe");
        }
      });
    }
  }
  else {
    //No se agregan estadios ni torneos
    var equipoNuevo = new Equipo({
      nombre: nombreNuevo,
      tecnico: tecnicoNuevo,
      escudo: escudoNuevo,
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
  var a;
  var b;
  Equipo.findOne({_id: req.params.id}).
  populate('torneos').
  populate('estadios').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if (result != null) {
      //Modifico nombre, tecnico y/o o escudo si se solicita
      result.nombre = req.body.nombre || result.nombre;
      result.tecnico = req.body.tecnico || result.tecnico;
      result.escudo = req.body.escudo || result.escudo;
      if (req.body.torneos) {
        //Vinieron torneos en el post (pueden ser los existentes o distintos)

        //Transformo el tipo de dato de "req.body.torneos"
        req.body.torneos = JSON.parse(req.body.torneos);

        //A cada torneo de "req.body.torneos" lo parseo a tipo "ObjectId" de mongo
        for(var w = 0; w < req.body.torneos.torneos.length; w++) {
          req.body.torneos.torneos[w] = mongoose.Types.ObjectId(req.body.torneos.torneos[w]);
        }

        if(result.torneos.length != 0) {
          //Ya tiene torneos el equipo, entonces:

          //Comparo cada torneo existente en el equipo con todos los que vinieron
          //y elimino los que se desean eliminar (no vinieron en el post)
          var continuar1 = 0;
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
  populate('torneos').
  populate('estadios').
  populate('jugadores').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result != null) {
      if(result.torneos.length == 0 && 
      result.estadios.length == 0 && result.jugadores.length == 0) {
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
                res.send("No se puede borrar el equipo porque se utiliza en un eventode algun partido");
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
        res.send("No se puede borrar el equipo porque se utiliza en otro lado");
      }
    } 
    else {
      res.send("El equipo no existe");
    }   
  });
});
      

module.exports=router;
