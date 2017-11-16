var mongoose = require('mongoose');
var Arbitro = mongoose.model('arbitro');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Arbitro.find(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result) {
      res.json(result);
    }
    else {
      res.send("No existe ningún árbitro");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Estadio.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    if(result) {
      res.json(result);
    } else {
      res.send("No existe el árbitro buscado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
    let nombreNuevo=req.body.nombre;
    let edadNuevo=req.body.edad;
    var arbitroNuevo = new Arbitro({
        nombre: nombreNuevo,
        edad: edadNuevo
    })
    arbitroNuevo.save((err) => {
        if(err){
        res.send(err);
        }
        else {
        res.send(arbitroNuevo);
        }
    })
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Arbitro.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.edad = req.body.edad || result.edad;
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
      res.send("El estadio que quiere modificar no existe");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Arbitro.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err, deleteArbitro) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deleteArbitro);
      })
    }
    else {
      res.send("No existe ese árbitro");
    }
  });
});

module.exports=router;