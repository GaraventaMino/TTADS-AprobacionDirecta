var mongoose = require('mongoose');
var Estadio = mongoose.model('estadio');
var Equipo = mongoose.model('equipo');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Estadio.find().
  populate('equipo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result) {
      res.json(result);
    }
    else {
      res.send("No existe ningún estadio");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Estadio.findOne({_id: req.params.id}).
  populate('equipo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    if(result) {
      res.json(result);
    } else {
      res.send("No existe el estadio buscado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  Equipo.findOne({_id: req.body.equipo}, function(err, resu) {
    if(err){
        res.send(err);
    }
    else if (resu){
        let nombreNuevo=req.body.nombre;
        let direccionNuevo=req.body.direccion;
        let equipoNuevo=req.body.equipo;
        let imagen=req.body.imagen;
        var estadioNuevo = new Estadio({
            nombre: nombreNuevo,
            direccion: direccionNuevo,
            equipo: equipoNuevo,
            imagen: imagen
        })
        estadioNuevo.save((err, guardado) => {
            if(err){
              res.send(err);
            }
            else {
              resu.estadio = guardado._id;
              resu.save((err) => {
                if (err) {
                  res.send(err);
                }
                else {
                  res.send(guardado);
                }
              })
            }
        })
    }
    else{
        res.send("No existe ese equipo");
    }
  });    
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Estadio.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.direccion = req.body.direccion || result.direccion;
      result.equipo = req.body.equipo || result.equipo;
      result.imagen = req.body.imagen || result.imagen;
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
  Estadio.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err, deleteEstadio) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deleteEstadio);
      })
    }
    else {
      res.send("No existe ese estadio");
    }
  });
});

module.exports=router;