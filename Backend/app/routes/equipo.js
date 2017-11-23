var mongoose = require('mongoose');
var Equipo = mongoose.model('equipo');
var Estadio = mongoose.model('estadio');
var Torneo = mongoose.model('torneo');
var router=require('express').Router()


//GET ALL
router.get('/', (req, res, next) => {
  Equipo.find().
  populate('jugadores').
  populate({
    path: 'estadios',
    select: 'nombre direccion'
  }).
  populate({
    path: 'torneo',
    select: 'nombre logo imagen_trofeo'
  }).
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
  populate('jugadores').
  populate({
    path: 'estadios',
    select: 'nombre direccion'
  }).  
  populate({
    path: 'torneo',
    select: 'nombre logo imagen_trofeo'
  }).
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
/* 
En este método se dice cual es el estadio y el torneo de mi nuevo equipo y el método
mismo se encarga de guardar en el modelo "Estadio" y en el modelo "Torneo" este nuevo equipo.
*/
router.post('/', (req, res, next) => {
  Estadio.findOne({_id: req.body.estadios}, (error, estad) => {
    if (error) {
      res.send(error);
    }
    else if (estad != null) {
      Torneo.findOne({_id: req.body.torneos}, (error, torn) => {
        if(error){
          res.send(error);
        }
        else if (torn != null) {
          let nombreNuevo=req.body.nombre;
          let tecnicoNuevo=req.body.tecnico;
          let estadioNuevo=req.body.estadios;
          let escudoNuevo=req.body.escudo;
          let torneosNuevo=req.body.torneos;
          var equipoNuevo = new Equipo({
              nombre: nombreNuevo,
              tecnico: tecnicoNuevo,
              estadios: estadioNuevo,
              escudo: escudoNuevo,
              torneos: torneosNuevo
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
                  torn.equipo = equipoGuardado._id;
                  torn.save((err, correcto) => {
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
          });
        }
        else {
          res.send("No existe el torneo elegido")
        }
      });
    }
    else {
      res.send("No existe el estadio elegido");
    }
  }); 
});
/////////////////ACA
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
