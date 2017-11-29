var mongoose = require('mongoose');
var Partido = mongoose.model('partido');
var Arbitro = mongoose.model('arbitro');
var Estadio = mongoose.model('estadio');
var Equipo = mongoose.model('equipo');
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
                  let fecha_hora=req.body.fecha_hora;
                  let equipo_local =req.body.equipo_local;
                  let equipo_visitante = req.body.equipo_visitante;
                  let arbitro = req.body.arbitro;
                  let estadio = req.body.estadio;
                  var partidoNuevo = new Partido({
                      fecha_hora: fecha_hora,
                      equipo_local: equipo_local,
                      equipo_visitante: equipo_visitante,
                      arbitro: arbitro,
                      estadio: estadio
                  })
                  partidoNuevo.save((err) => {
                    if(err){
                      res.send(err);
                    }
                    else {
                      
                    }
                  });
                }
                else {
                  res.send("No existe el árbitro que se eligió");
                }
              })
            }
            else {
              res.send("No existe el equipo visitante que se eligió");
            }
          })
        }
        else {
          res.send("No existe el equipo local que se eligió");
        }
      })
    }
    else {
      res.send("No existe el estadio que se eligió");
    }
  });
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Partido.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.fecha_hora = req.body.fecha_hora || result.fecha_hora;
      result.equipo_local = req.body.equipo_local || result.equipo_local;
      result.equipo_visitante = req.body.equipo_visitante || result.equipo_visitante;
      result.arbitro = req.body.arbitro || result.arbitro;
      result.estadio = req.body.estadio || result.estadio;
      result.save((err, result) => {
        if(err) {
          res.status(500).send(err)
        }
        else {
          res.status(200).send(result);
        }
      });
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