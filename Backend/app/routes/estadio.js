var mongoose = require('mongoose');
var Estadio = mongoose.model('estadio');
var Equipo = mongoose.model('equipo');
var router=require('express').Router()


//GET LIBRES
router.get('/libres', (req, res, next) => {
  Estadio.find().
  where('equipo' == null). //CHEQUEAR ESTO
  populate('equipo').
  exec((err, result) => {
    if (err) {
      res.send(err);
    }
    else if (result.length != 0) {
      res.json(result);
    }
    else {
      res.json("No existe ningún estadio sin equipo");
    }
  });
});

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
  let nombreNuevo = req.body.nombre;
  let direccionNuevo = req.body.direccion;
  let imagenNuevo = req.body.imagen;
  let equipoNuevo = null;
  var estadioNuevo = new Estadio({
      nombre: nombreNuevo,
      direccion: direccionNuevo,
      imagen: imagenNuevo,
      equipo: equipoNuevo
  });
  estadioNuevo.save((err, guardado) => {
      if(err){
        res.send(err);
      }
      else {
        res.send("Estadio creado con éxito");
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
  Estadio.findOne({_id: req.params.id}, (err, result) => {
    if (err) {
      res.send(err);
    }
    else if(result != null) {
      if(result.equipo != null) {
        Equipo.findOne({_id: result.equipo}, (err, eq) => {
          if(err) {
            res.send(err);
          }
          else if (eq != null) {
            eq.estadio = null;
            eq.save((err) => {
              if(err) {
                res.send(err);                
              }
              else {
                result.remove((err) => {
                  if(err) {
                    res.send(err);
                  }
                  else {
                    res.send("Estadio borrado con éxito");
                  }
                });
              }
            });
          }
          else {
            res.send("El estadio tiene un equipo, pero no existe dicho equipo. NO DEBERIA PASAR ESTO");
          }        
        });
      }
      else {
        result.remove((err) => {
          if(err) {
            res.send(err);
          }
          else {
            res.send("Estadio borrado con éxito");
          }
        });
      }      
    }
    else {
      res.send("No existe ese estadio");
    }
  });
});

module.exports=router;