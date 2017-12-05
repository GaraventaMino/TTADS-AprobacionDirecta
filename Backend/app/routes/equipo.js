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
    if(result.length != 0) {
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
    var continuar1=1;
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
          if(estad.equipo) {
            res.send("Algún estadio de los que se eligieron, ya pertenece a un equipo");
          }
          else {
            estadiosNuevo.push(estad._id);
            if(continuar1 == req.body.estadios.estadios.length) {
              if(req.body.torneos) {
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
                          estadios: estadiosNuevo,
                          escudo: escudoNuevo,
                          torneos: torneosNuevo
                        });
                        equipoNuevo.save((err, equipoGuardado) => {
                          if(err){
                            res.send(err);
                          }
                          else {
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
                                  });
                                }
                              });
                            }
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
                                  });
                                }
                              });
                            }
                            res.send("Equipo creado correctamente con estadios y torneos");
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
                            else {
                              res.send("Equipo creado correctamente sin torneos pero con estadios");
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
              continuar++;
            }
          }
        }
        else {
          res.send("Algún estadio seleccionado no existe");
        }
      });
    }
  }
  if(req.body.torneos) {
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
            console.log(equipoNuevo.torneos);
            console.log(torneosNuevo);
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
  //var hayTorneos = true;
  //var hayEstadios = true;
  Equipo.findOne({_id: req.params.id}).
  populate('torneos').
  populate('estadios').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if (result != null) {
      result.nombre = req.body.nombre || result.nombre;
      result.tecnico = req.body.tecnico || result.tecnico;
      result.escudo = req.body.escudo || result.escudo;
      if (req.body.torneos) {
        for(var i = 0; i < result.torneos.length; i++) {
          a = 2;
          for(var w = 0; w < req.body.torneos.length; w++) {
            if (result.torneos[i]._id == req.body.torneos[w]) {
              a = 1;
            }
          }
          if (a == 2) {
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
                  }  
                }
                to.save((err) => {
                  if(err) {
                    res.send(err);
                  }
                });
              }
              else {
                res.send("Algún torneo que eligió no existe");
              }
            });
          }
          for(var i = 0; i < req.body.torneos.length; i++) {
            a = 2;
            for(var w = 0; w < result.torneos.length; w++) {
              if (result.torneos[w]._id == req.body.torneos[i]) {
                a = 1;
              }
            }
            if (a == 2) {
              Torneo.findOne({_id: req.body.torneos[i]}).
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
                  });
                }
                else {
                  res.send("Algún torneo que eligió no existe");
                }
              });
            }
          }
        }
      }
      if (req.body.estadios != null) {
        for(var i = 0; i < result.estadios.length; i++) {
          b = 2;
          for(var w = 0; w < req.body.estadios.length; w++) {
            if (result.estadios[i]._id == req.body.estadios[w]) {
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
                });
              }
              else {
                res.send("Algún estadio que eligió no existe");
              }
            });
          }
          for(var i = 0; i < req.body.estadios.length; i++) {
            b = 2;
            for(var w = 0; w < result.estadios.length; w++) {
              if (result.estadios[w]._id == req.body.estadios[i]) {
                b = 1;
              }
            }
            if (b == 2) {
              Estadio.findOne({_id: req.body.estadios[i]}).
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
                  });
                }
                else {
                  res.send("Algún estadio que eligió no existe");
                }
              });
            }
          }
        }
      }
      result.save((err) => {
        if(err) {
          res.send(err);
        }
        else {
          res.send("Equipo modificado con éxito");
        }
      });
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
    else if(result.torneos.length == 0 && 
    result.estadios.length == 0 && result.jugadores.length == 0) {
      Evento.find({}, 'equipo').
      populate('equipo').
      exec((err, eventos) => {
        if(err){
          res.send(err);
        }
        else {
          for(var i = 0; i < eventos.length; i++) {
            if(eventos[i].equipo._id == result._id) {
              res.send("No se puede borrar el equipo porque se utiliza en un evento");
            }
          }
          Partido.find({}, 'equipo_local equipo_visitante').
          populate('equipo_local').
          populate('equipo_visitante').
          exec((err, partidos) => {
            if(err){
              res.send(err);
            }
            else if (partidos.length != 0) {
              for(var j = 0; j < partidos.length; j++) {
                if(partidos[j].equipo_local._id == result._id || 
                partidos[j].equipo_visitante._id == result._id) {
                  res.send("No se puede borrar el equipo porque se utiliza en un partido");
                }
              }
            }
            result.remove((err) => {
              if(err) {
                res.send(err);
              }
              else {
                res.send("Equipo eliminado correctamente");
              }
            });
          });
        }
      });
    }
    else {
      res.send("No se puede borrar el equipo porque se utiliza en otro lado");
    }
  });
});
      

module.exports=router;
