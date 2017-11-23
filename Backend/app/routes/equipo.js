var mongoose = require('mongoose');
var Equipo = mongoose.model('equipo');
var Estadio = mongoose.model('estadio');
var router=require('express').Router()

//Crear prueba
router.post('/prueba', (req, res, next) => {
  Estadio.findOne({_id: req.body.estadio}, (error, estad) => {
    if (error) {
      res.send(error);
    }
    else if (estad != null) {
      let nombreNuevo=req.body.nombre;
      let tecnicoNuevo=req.body.tecnico;
      let estadioNuevo=req.body.estadio;
      let escudoNuevo=req.body.escudo;
      var equipoNuevo = new Equipo({
          nombre: nombreNuevo,
          tecnico: tecnicoNuevo,
          estadios: estadioNuevo,
          escudo: escudoNuevo
      })
      equipoNuevo.save((err, equipoGuardado) => {
        if(err){
          res.send(err);
        }
        else {
          estad.equipo = equipoGuardado._id;
          estad.save((err, correcto) => {
            if(err){
              res.send(err);
            }
            else {
              res.send("Equipo creado correctamente");
            }
          });
        }
      });
    }
    else {
      res.send("No existe el estadio elegido");
    }
  }); 
});

//GET ALL
router.get('/', (req, res, next) => {
  Equipo.find().
  populate('jugador').
  populate({
    path: 'estadios',
    select: 'nombre direccion'
  }).
  populate('torneo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if (result.length != 0) {
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
  populate('estadios').
  populate('torneo').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    if(result.length != 0) {
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
