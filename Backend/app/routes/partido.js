var mongoose = require('mongoose');
var Partido = mongoose.model('partido');
var Arbitro = mongoose.model('arbitro');
var Estadio = mongoose.model('estadio');
var Equipo = mongoose.model('equipo');
var Torneo = mongoose.model('torneo');
var router=require('express').Router()

//Get Partidos activos
router.get('/activos', (req, res) => {
  var today = new Date();
  Partido.
  where('fecha_hora').gt(today.getTime() - (6300000)).
  lt(today.getTime()).
  sort({fecha_hora: 'asc'}).
  populate('equipo_local').
  populate('equipo_visitante').
  populate('torneo').
  populate('arbitro').
  populate('estadio').
  populate({
    path: 'eventos',
    populate: { path: 'equipo' }   
  }).
  populate({
    path: 'eventos',
    populate: { path: 'tipo_evento' }
  })
  .exec(function (err, partido) {
    if (err) {
      res.send(err);
    }
    else if(partido.length != 0) {
      res.json(partido);
    }
    else {
      res.json("Ningún partido en curso");
    }
  });
});

//Get Partidos planificados (ni activos ni finalizados)
router.get('/planificados', (req, res) => {
  var today = new Date();
  Partido.
  find().
  where('fecha_hora').gt(today.getTime()).
  sort({fecha_hora: 'asc'}).
  populate({
    path: 'equipo_local',
    populate: { path: 'jugadores' }
    }).
  populate({
    path: 'equipo_visitante',
    populate: { path: 'jugadores' }
    }).
  populate('arbitro').
  populate('estadio').
  populate({
    path: 'eventos',
    populate: { path: 'equipo' },
    
  }).
  populate({
    path: 'eventos',
    populate: { path: 'tipo_evento' }
  }).
  populate('torneo').
  exec(function (err, partido) {
    if (err) {
      res.send(err);
    }
    else if(partido.length != 0) {
      res.json(partido);
    }
    else {
      res.json("Ningún partido planificado");
    }
  });
});

//GET ALL
router.get('/', (req, res, next) => {
  Partido.
  find().
  populate({
    path: 'equipo_local',
    populate: { path: 'jugadores' }
    }).
  populate({
    path: 'equipo_visitante',
    populate: { path: 'jugadores' }
    }).
  populate({
    path: 'eventos',
    populate: { path: 'equipo' },
  }).
  populate({
    path: 'eventos',
    populate: { path: 'tipo_evento' }
  }).
  populate('torneo').
  populate('arbitro').
  populate('estadio').
  exec((err, partido) => {
    if (err) {
      res.send(err);
    }
    else if(partido.length != 0) {
      res.json(partido);
    }
    else {
      res.json("Ningún partido encontrado");
    }
  });
});

//Get one
router.get('/:id', (req, res, next) => {
  Partido.
    findOne({_id: req.params.id}).
    populate({
      path: 'equipo_local',
      populate: { path: 'jugadores' }
      }).
    populate({
      path: 'equipo_visitante',
      populate: { path: 'jugadores' }
      }).
    populate({
    path: 'eventos',
    populate: { path: 'equipo' },
    }).
    populate({
      path: 'eventos',
      populate: { path: 'tipo_evento' }
    }).
    populate({
      path: 'eventos',
      populate: { path: 'jugador' }
    }).
    populate('torneo').
    populate('arbitro').
    populate('estadio').    
    exec(function (err, partido) {
      if (err) {
        res.send(err);
      }
      else if(partido.length != 0) {
        res.json(partido);
      }
      else {
        res.json("Ningún partido encontrado");
      }
    });
});

//CREATE
router.post('/', (req, res, next) => {
  if(req.body.estadio) {
    Estadio.findOne({_id: req.body.estadio}, (err, es) => {
      if(err) {
        res.send(err);
      }
      else if (es != null) {
        Equipo.findOne({_id: req.body.equipo_local}, (err, eql) => {
          if(err) {
            res.send(err);
          }
          else if (eql != null) {
            Equipo.findOne({_id: req.body.equipo_visitante}, (err, eqv) => {
              if(err) {
                res.send(err);
              }
              else if (eqv != null) {
                Arbitro.findOne({_id: req.body.arbitro}, (err, ar) => {
                  if(err) {
                    res.send(err);
                  }
                  else if(ar != null) {
                    Torneo.findOne({_id: req.body.torneo}, (err, to) => {
                      if(err) {
                        res.send(err);
                      }
                      else if (to != null) { 
                        let fecha_hora = req.body.fecha_hora;
                        let equipo_local = req.body.equipo_local;
                        let equipo_visitante = req.body.equipo_visitante;
                        let arbitro = req.body.arbitro;
                        let estadio = req.body.estadio;
                        let torneo = req.body.torneo;
                        var paNuevo = new Partido({
                          fecha_hora: fecha_hora,
                          equipo_local: equipo_local,
                          equipo_visitante: equipo_visitante,
                          arbitro: arbitro,
                          estadio: estadio,
                          torneo: torneo,
                        });
                        paNuevo.save((err, paGuardado) => {
                          if(err){
                            res.send(err);
                          }
                          else {                            
                            paGuardado.save((err) => {
                              if(err) {
                                res.send(err);
                              }
                              else {
                                to.partidos.push(paGuardado._id);
                                to.save((err) => {
                                  if(err) {
                                    res.send(err);
                                  }
                                  else {
                                    res.json("Partido creado con éxito");
                                  }
                                });
                              }
                            });                            
                          }
                        });
                      }
                      else {
                        res.json("No existe el torneo que se eligió")
                      }
                    });
                  }
                  else {
                    res.json("No existe el árbitro que se eligió");
                  }
                });
              }
              else {
                res.json("No existe el equipo visitante que se eligió");
              }
            });
          }
          else {
            res.json("No existe el equipo local que se eligió");
          }
        });
      }
      else {
       res.json("No existe el estadio que se eligió");
     }
    });
  }
  else {
    res.json("Debe seleccionar un estadio");
  }
});

//UPDATE
/* 
A un partido solo se le puede modificar:
- fecha_hora
- arbitro
- estadio

No tiene sentido modificarle los equipos o el torneo (en dicho caso es más lógico crear un nuevo partido)

Los eventos del partido se manejan desde "/app/routes/evento.js"
*/
router.put('/:id', (req, res, next) => {
  Partido.findOne({_id: req.params.id}, function (err, pa) {
    if (err) {
      res.send(err);
    } 
    else if (pa != null) {
      var today = new Date();
      if(pa.fecha_hora.getTime() > today.getTime()) {
        if(req.body.fecha_hora) {
          pa.fecha_hora = req.body.fecha_hora;
        }        
        pa.arbitro = req.body.arbitro || pa.arbitro;
        pa.estadio = req.body.estadio || pa.estadio;
        pa.save((err) => {
          if(err) {
            res.send(err);
          }
          else {
            res.json("Partido modificado con éxito");
          }
        });
      }
      else {
        res.json("No se puede modificar un partido que ya comenzó o finalizó");
      }
    }
    else {
      res.json("El partido que desea modificar no existe");
    }
  });
});

//DELETE ONE
/* 
Solo se pueden eliminar partidos que no hayan comenzado aún.

El método se encarga de borrarle el partido al torneo también.
*/
router.delete('/:id', (req, res, next) => {
  Partido.findOne({_id: req.params.id}).
  populate('torneo').
  exec((err, pa) => {
    if (err) {
      res.send(err);
    }
    else if(pa != null) {
      var today = new Date();
      if(pa.fecha_hora.getTime() > today.getTime()) {
        Torneo.findOne({_id: pa.torneo._id}).
        populate('partidos').
        exec((err, to) => {
          if(err) {
            res.send(err);
          }
          else if(to != null) {
            pa.remove((err) => {
              if(err) {
                res.send(err);
              }
              else {
                for(var i = 0; i < to.partidos.length; i++) {
                  if(to.partidos[i]._id.equals(pa._id)) {
                    var removed = to.partidos.splice(i, 1);
                    to.save((err) => {
                      if(err) {
                        res.send(err);
                      }
                      else {
                        res.json("Partido eliminado con éxito");               
                      }
                    });
                  }
                }
              }
            });
          }
          else {
            res.json("Error a buscar el torneo al que pertenece el partido");
          }
        });
      }
      else {
        res.json("No se puede eliminar un partido que ya comenzó o finalizó");
      }
    }
    else {
      res.json("No existe ese Partido");
    }
  });
});

module.exports=router;