var mongoose = require('mongoose');
var Partido = mongoose.model('partido');
var Arbitro = mongoose.model('arbitro');
var Estadio = mongoose.model('estadio');
var Equipo = mongoose.model('equipo');
var Torneo = mongoose.model('torneo');
var router=require('express').Router()

//Finalizar partido
router.put('/:id/finalizar', (req, res, next) => {
  Partido.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if (result != null) {
      result.finalizado = true;
      result.save((err) => {
        if(err) {
          res.send(err)
        }
        else {
          res.send("¡Partido finalizado con éxito!");
        }
      });
    }
    else {
      res.send("El partido que desea finalizar no existe");
    }
  });
});

//Get Partidos activos
router.get('/activos', (req, res, next) => {
  var today = new Date();
  Partido.
  where('fecha_hora').gt(today.getTime() - (6300000)).
  //lt(today.getTime() + (6300000)).
  where('finalizado' == false).
  sort({fecha_hora: 'asc'}).
  populate('equipo_local').
  populate('equipo_visitante').
  populate('arbitro').
  populate('estadio').
  populate('torneo').
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
      res.send("Ningún partido en curso");
    }
  });
});

//Get Partidos planificados (ni activos ni finalizados)
router.get('/planificados', (req, res, next) => {
  var today = new Date();
  Partido.
  find().
  where('fecha_hora').gt(today.getTime()).
  sort({fecha_hora: 'asc'}).
  populate('equipo_local').
  populate('equipo_visitante').
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
  populate('arbitro').
  populate('estadio').
  populate('torneo').
  exec(function (err, partido) {
    if (err) {
      res.send(err);
    }
    else if(partido.length != 0) {
      res.json(partido);
    }
    else {
      res.send("Ningún partido planificado");
    }
  });
});

//GET ALL
router.get('/', (req, res, next) => {
  Partido.
  find().
  populate('equipo_local').
  populate('equipo_visitante').
  populate({
    path: 'eventos',
    populate: { path: 'equipo' },
    
  }).
  populate({
    path: 'eventos',
    populate: { path: 'tipo_evento' }
  }).
  populate('arbitro').
  populate('estadio').
  populate('torneo').
  exec(function (err, partido) {
    if (err) {
      res.send(err);
    }
    else if(partido.length != 0) {
      res.json(partido);
    }
    else {
      res.send("Ningún partido encontrado");
    }
  });
});

//Get one
router.get('/:id', (req, res, next) => {
  Partido.
    findOne({_id: req.params.id}).
    populate('equipo_local').
    populate('equipo_visitante').
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
    populate('arbitro').
    populate('estadio').
    populate('torneo').
    exec(function (err, partido) {
      if (err) {
        res.send(err);
      }
      else if(partido.length != 0) {
        res.json(partido);
      }
      else {
        res.send("Ningún partido encontrado");
      }
    });
});

//CREATE
router.post('/', (req, res, next) => {
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
                      let fecha_hora=req.body.fecha_hora;
                      let equipo_local =req.body.equipo_local;
                      let equipo_visitante = req.body.equipo_visitante;
                      let arbitro = req.body.arbitro;
                      let estadio = req.body.estadio;
                      let torneo = req.body.torneo
                      var paNuevo = new Partido({
                          fecha_hora: fecha_hora,
                          equipo_local: equipo_local,
                          equipo_visitante: equipo_visitante,
                          arbitro: arbitro,
                          estadio: estadio,
                          torneo: torneo
                      });
                      paNuevo.save((err, paGuardado) => {
                        if(err){
                          res.send(err);
                        }
                        else {
                          to.partidos.push(paGuardado._id);
                          to.save((err) => {
                            if(err) {
                              res.send(err);
                            }
                            else {
                              res.send("Partido creado con éxito");
                            }
                          });
                        }
                      });
                    }
                    else {
                      res.send("No existe el torneo que se eligió")
                    }
                  });
                }
                else {
                  res.send("No existe el árbitro que se eligió");
                }
              });
            }
            else {
              res.send("No existe el equipo visitante que se eligió");
            }
          });
        }
        else {
          res.send("No existe el equipo local que se eligió");
        }
      });
    }
    else {
      res.send("No existe el estadio que se eligió");
    }
  });
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
    else if (pa) {
      var today = new Date();
      //Quizá falle la validación de la fecha (CHEQUEAR)
      if(pa.fecha_hora > today.getTime()) {
        pa.fecha_hora = req.body.fecha_hora || pa.fecha_hora;
        pa.arbitro = req.body.arbitro || pa.arbitro;
        pa.estadio = req.body.estadio || pa.estadio;
        pa.save((err) => {
          if(err) {
            res.send(err)
          }
          else {
            res.send("Partido modificado con éxito");
          }
        });
      }
    }
    else {
      res.send("El partido que desea modificar no existe");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Partido.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err, deletePartido) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deletePartido);
      })
    }
    else {
      res.send("No existe ese Partido");
    }
  });
});

module.exports=router;