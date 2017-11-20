var mongoose = require('mongoose');
var Torneo = mongoose.model('torneo');
var Jugador = mongoose.model('jugador');
var router=require('express').Router()


//Get Presentacion de todos los torneos
router.get('/', (req, res, next) => {
  Torneo.find({}, '_id nombre logo imagen_trofeo', function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result.length != 0) {
      res.json(result);
    }
    else {
      res.send("No existe ningún torneo aún");
    }
  });
});

//Get Tabla de posiciones de un torneo
router.get('/:id/posiciones', (req, res, next) => {
  Torneo.find({_id: req.params.id}, 'equipos').
  populate('equipos', 'nombre puntaje').
  sort('-puntaje').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.json(result);
    }
  });
});

//Get Tabla de goleadores de un torneo
router.get('/:id/goleadores', (req, res, next) => {
  //Debería borrar los goles de todos los jugadores acá, para que no se mezclen entre torneos.
  Torneo.find({_id: req.params.id}, 'partidos').
  populate({
    path: 'partidos',
    select: 'eventos',
    populate: ({ 
      path: 'eventos',
      select: 'tipo_evento jugador',
      populate: ({
        path: 'tipo_evento',
        select: 'nombre',
      }),
      populate: ({
        path: 'jugador',
        select: '_id nombre',
      })
    }),
  }).
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      for(var i = 0; i < result.partidos.length; i++) {
        for(var j = 0; j < result.partidos[i].eventos.length; j++) {
          if(result.partidos[i].eventos[j].tipo_evento.nombre == "Gol") {
            
          }
        }
      }
      res.json(result);
    }
  });
});


//GET ALL
router.get('/', (req, res, next) => {
  Torneo.find(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result.length != 0) {
      res.json(result);
    }
    else {
      res.send("No existe ningún torneo aún");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Torneo.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    if(result.length != 0) {
      res.json(result);
    } else {
      res.send("Ningún Torneo Encontrado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  let nombre=req.body.nombre;
  let logo=req.body.logo;
  let imagen_trofeo=req.body.imagen_trofeo;
  var torneoNuevo = new Torneo({
      nombre: nombre,
      logo: logo,
      imagen_trofeo: imagen_trofeo
  })
  torneoNuevo.save((err, result) => {
    if(err){
      res.send(err);
    }
    else {
      res.send(result);
    }
  })
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Torneo.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.logo = req.body.logo || result.logo;
      result.imagen_trofeo = req.body.imagen_trofeo || result.imagen_trofeo;
      result.save((err, resultado) => {
        if(err) {
          res.status(500).send(err)
        }
        else {
          res.status(200).send(resultado);
        }
      });
    }
    else {
      res.send("No existe el torneo que desea modificar");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Torneo.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err, deleteTorneo) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deleteTorneo);
      })
    }
    else {
      res.send("No existe ese torneo");
    }
  });
});


module.exports=router;