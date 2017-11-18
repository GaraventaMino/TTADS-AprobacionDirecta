var mongoose = require('mongoose');
var Equipo = mongoose.model('equipo');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Equipo.find().
  populate('jugador').
  populate('estadio').
  populate('torneo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result) {
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
  populate('jugador').
  populate('estadio').
  populate('torneo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    if(result) {
      res.json(result);
    } else {
      res.send("No existe el equipo buscado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  let nombreNuevo=req.body.nombre;
  let tecnicoNuevo=req.body.tecnico;
  let escudoNuevo=req.body.escudo;
  var equipoNuevo = new Equipo({
      nombre: nombreNuevo,
      tecnico: tecnicoNuevo,
      escudo: escudoNuevo
  })
  equipoNuevo.save((err) => {
    if(err){
      res.send(err);
    }
    else {
      res.send(equipoNuevo);
    }
  })
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Equipo.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.tecnico = req.body.tecnico || result.tecnico;
      result.escudo = req.body.escudo || result.escudo;
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
      res.send("El equipo que quiere modificar no existe");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Equipo.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err, deleteEquipo) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deleteEquipo);
      })
    }
    else {
      res.send("No existe ese equipo");
    }
  });
});

module.exports=router;
