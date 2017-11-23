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
                  torn.equipos.push(equipoGuardado._id);
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


//UPDATE
router.put('/:id', (req, res, next) => {
  var a = 0;
  var b = 0;
  Equipo.findOne({_id: req.params.id}).
  populate('torneos').
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    } 
    else if (result) {
      result.nombre = req.body.nombre || result.nombre;
      result.tecnico = req.body.tecnico || result.tecnico;
      result.escudo = req.body.escudo || result.escudo;
      if (result.torneos.length == 0) {
        if (req.body.torneos.length != 0) {
          result.torneos.push(req.body.torneos);
        }
      }
      else if (req.body.torneos.length != 0) {
        for(var i = 0; i < result.torneos.length; i++) {
            if (result.torneos[i] == req.body.torneos) {
              a = 1;
            }
            else {
              a = 2;
            }
          }
          if (a == 2) {
            result.torneos.push(req.body.torneos);
          }
      }
      if (result.estadios.length == 0) {
        if (req.body.estadios.length != 0) {
          result.estadios.push(req.body.estadios);
        }
      }
      if (req.body.estadios.length != 0) {
        for(var j = 0; j < result.estadios.length; j++) {
          if (result.estadios[j] == req.body.estadios) {
            b = 1
          }
          else {
            b = 2;
          }
        }
        if (b == 2) {
          result.estadios.push(req.body.estadios);
        }
      }
      result.save((err, guardado) => {
        if(err) {
          res.status(500).send(err);
        }
        else {
          if (guardado.torneos.length != 0 && a == 2) {
            Torneo.findOne({_id: req.body.torneos}, (err, t) => {
              if (err) {
                res.send(err);
              }
              else {
                t.equipos.push(equipoGuardado._id);
                t.save((err) => {
                  if(err) {
                    res.send(err);
                  }
                });
              }
            });
          }
          setTimeout(() => {
            if (guardado.estadios.length != 0 && a == 2) {
              Estadio.findOne({_id: req.body.estadios}, (err, e) => {
                if (err) {
                  res.send(err);
                }
                else {
                  e.equipo = equipoGuardado._id;
                  e.save((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      res.send("Equipo modificado con éxito");
                    }
                  });
                }
              });
            }
          }, 3000);
          res.send("Equipo modificado con éxito");
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
  Equipo.findOne({_id: req.params.id}).
  populate({
    path: 'torneos',
    select: '_id'
  }).
  exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {
      result.remove((err) => {
        if(err) {
          res.status(500).send(err);
        }
        else {
          for (var i = 0; i < result.torneos.length; i++) {
            Torneo.findOne({_id: result.torneos[i]._id}).
            populate({
              path: 'equipos',
              select: '_id'
            }).
            exec((err, corr) => {
              for (var j = 0; j < corr.equipos.length; j++) {
                if(corr.equipos[j]._id == result._id) {
                  delete corr.equipos[j];
                  corr.save((err) => {
                    if (err) {
                      res.send(err);
                    }
                    else {
                      res.send("Borrado realizado");
                    }
                  });
                }
                else {
                  res.send("Borrado realizado");
                }
              }
            });
            //FALTA ELIMINARLE EL EQUIPO A LOS PARTIDOS,JUGADOR,ESTADIO,EVENTO
          }
          
          res.send("Equipo eliminado correctamente");
        }
      })
    }
    else {
      res.send("No existe ese equipo");
    }
  });
});

module.exports=router;
