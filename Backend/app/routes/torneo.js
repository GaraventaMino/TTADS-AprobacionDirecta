var mongoose = require('mongoose');
var Torneo = mongoose.model('torneo');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Torneo.find(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result) {
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
    if(result) {
      res.json(result);
    } else {
      res.send("Ningún Torneo Encontrado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  let nombre=req.body.nombre;
  var torneoNuevo = new Torneo({
      nombre: nombre
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