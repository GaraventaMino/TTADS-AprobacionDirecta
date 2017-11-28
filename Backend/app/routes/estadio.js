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
      res.send(err);
    }
    else if (result.length != 0) {
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
      res.send(err);
    } 
    if(result.length != 0) {
      res.json(result);
    } 
    else {
      res.send("No existe el estadio buscado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  let nombreNuevo=req.body.nombre;
  let direccionNuevo=req.body.direccion;
  let imagen=req.body.imagen;
  var estadioNuevo = new Estadio({
      nombre: nombreNuevo,
      direccion: direccionNuevo,
      imagen: imagen
  })
  estadioNuevo.save((err, guardado) => {
      if(err){
        res.send(err);
      }
      else {
        res.send(guardado);
      }
  });
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Estadio.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.direccion = req.body.direccion || result.direccion;
      result.imagen = req.body.imagen || result.imagen;
      result.save((err, result) => {
        if(err) {
          res.send(err)
        }
        else {
          res.send("Estadio modificado con éxito");
        }
      });
    }
    else {
      res.send("El estadio que quiere modificar no existe");
    }
  });
});

//DELETE ONE
/* 
El método se encarga de borrar el estadio y de borrarselo al equipo que lo contenga.
*/
router.delete('/:id', (req, res, next) => {
  Estadio.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result != null) {
      Equipo.find().
      populate('estadios').
      exec((err, eq) => {
        if(err) {
          res.send(err);
        }
        else if (eq.length != 0) {
          for(var i = 0; i < eq.length; i++) {
            for(var j = 0; j < eq[i].estadios.length; j++) {
              if(eq[i].estadios[j]._id == result._id) {
                Equipo.findOne({_id: eq[i]._id}).
                populate('estadios').
                exec((err, eq1) => {
                  if(err) {
                    res.send(err);
                  }
                  else if (eq1 != null) {
                    var removed = eq1.estadios.splice(j, 1);
                    eq1.save((err, guardado) => {
                      if(err) {
                        res.send(err);
                      }
                    });
                  }
                  else {
                    res.send("Error al buscar el Equipo que contiene a este estadio");
                  }
                });
              }
            }
          }
        }
        result.remove((err) => {
          if(err) {
            res.send(err);
          }
          else {
            res.send("Estadio borrado con éxito");
          }
        });
      });
    }
    else {
      res.send("No existe ese estadio");
    }
  });
});

module.exports=router;