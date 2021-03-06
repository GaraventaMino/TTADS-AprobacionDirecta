var mongoose = require('mongoose');
var Tipo_evento = mongoose.model('tipo_evento');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Tipo_evento.find(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if (result.length != 0) {
      res.json(result);
    }
    else {
      res.send("No existe ningún tipo de evento aún");
    }
  });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Tipo_evento.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result != null) {
      res.json(result);
    } 
    else {
      res.send("Ningún Tipo de evento Encontrado");
    } 
  });
});

//CREATE
router.post('/', (req, res, next) => {
  let nombre=req.body.nombre;
  let icono=req.body.icono;
  var tipo_eventoNuevo = new Tipo_evento({
      nombre: nombre,
      icono: icono
  })
  tipo_eventoNuevo.save((err, result) => {
    if(err){
      res.send(err);
    }
    else {
      res.send("Tipo de evento creado correctamente");
    }
  })
});

//UPDATE
router.put('/:id', (req, res, next) => {
  Tipo_evento.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.send(err);
    } 
    else if (result != null) {
      result.nombre = req.body.nombre || result.nombre;
      result.icono = req.body.icono || result.icono;
      result.save((err, resultado) => {
        if(err) {
          res.send(err)
        }
        else {
          res.send("Tipo de evento modificado con éxito");
        }
      });
    }
    else {
      res.send("No existe el tipo de evento que desea modificar");
    }
  });
});

//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Tipo_evento.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result != null) {
      Evento.find().
      populate('tipo_evento').
      exec((err, ev) => {
        if(err) {
          res.send(err);
        }
        else if (ev.length != 0) {
          for(var j = 0; j < ev.length; j++) {
            if(ev[j].tipo_evento._id == result._id) {
              res.send("No se puede eliminar el tipo de evento porque ya ha sido utilizado en algún partido");
            }
          }
        }
        result.remove((err) => {
          if(err) {
            res.send(err);
          }
          else {
            res.send("Tipo de evento eliminado correctamente");
          }
        });
      });
    }
    else {
      res.send("No existe ese tipo de evento");
    }
  });
});


module.exports=router;