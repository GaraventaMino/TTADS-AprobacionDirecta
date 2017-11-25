var mongoose = require('mongoose');
var Arbitro = mongoose.model('arbitro');
var Partido = mongoose.model('partido');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Arbitro.find(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result.length != 0) {
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
    if(result.length != 0) {
      res.json(result);
    } 
    else {
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
    });
    arbitroNuevo.save((err) => {
        if(err) {
          res.send(err);
        }
        else {
          res.send("Árbitro creado correctamente");
        }
    });
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Arbitro.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result != null) {
      result.nombre = req.body.nombre || result.nombre;
      result.edad = req.body.edad || result.edad;
      result.save((err, result) => {
        if(err) {
          res.send(err);
        }
        else {
          res.send("Árbitro modificado con éxito");
        }
      });
    }
    else {
      res.send("El árbitro que quiere modificar no existe");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Arbitro.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result != null) {
      Partido.find().
      populate('arbitro').
      exec((err, pa) => {
        if(err) {
          res.send(err);
        }
        else if (pa.length != 0) {
          for(var i = 0; i < pa.length; i++) {
            if(pa[i].arbitro._id == result._id) {
              res.send("No se puede eliminar el árbitro porque participa en algún partido");
            } 
          }
        }
        result.remove((err, deleteArbitro) => {
          if(err) {
            res.send(err);
          }
          else {
            res.send("Árbitro eliminado con éxito");
          }
        });
      });
    }
    else {
      res.send("No existe ese árbitro");
    }
  });
});

module.exports=router;