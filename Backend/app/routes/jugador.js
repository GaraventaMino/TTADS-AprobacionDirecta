var mongoose = require('mongoose');
var Jugador = mongoose.model('jugador');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Jugador.find().
  populate('equipo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result) {
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
      res.status(500).send(err);
    } 
    if(result) {
      res.json(result);
    } else {
      res.send("Ningún Jugador Encontrado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  let nombre=req.body.nombre;
  let edad=req.body.edad;
  let equipo=req.body.equipo;
  var jugadorNuevo = new Tipo_evento({
      nombre: nombre,
      edad: edad,
      equipo: equipo
  })
  jugadorNuevo.save((err, result) => {
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
  Jugador.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.edad = req.body.edad || result.edad;
      result.equipo = req.body.equipo || result.equipo;
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
      res.send("No existe el Jugador que desea modificar");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Jugador.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err, deleteJugador) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deleteJugador);
      })
    }
    else {
      res.send("No existe ese Jugador");
    }
  });
});


module.exports=router;