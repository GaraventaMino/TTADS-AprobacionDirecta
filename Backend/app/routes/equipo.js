var mongoose = require('mongoose');
var Equipo = mongoose.model('equipo');
var Estadio = mongoose.model('estadio');
var Torneo = mongoose.model('torneo');
var Evento = mongoose.model('evento');
var Partido = mongoose.model('partido');
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
    } 
    else {
      res.send("No existe el equipo buscado");
    } 
  });
});

//CREATE
/* 
En este método se dice cual es el estadio y el torneo de mi nuevo equipo y el método
mismo se encarga de guardar en el modelo "Estadio" y en el modelo "Torneo" este nuevo equipo.

IMPORTANTE:
Para crear un equipo, es obligatorio que se le asigne un estadio y un torneo.
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
    else if (result != null) {
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
          /* if (guardado.torneos.length != 0 && a == 2) {
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
          }, 3000); */
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
  populate('torneos').
  populate('estadios').
  populate('jugadores').
  exec(function (err, result) {
    if (err) {
      res.send(err);
    }
    else if(result.torneos.length == 0 && 
    result.estadios.length == 0 && result.jugadores.length == 0) {
      Evento.find({}, 'equipo').
      populate('equipo').
      exec((err, eventos) => {
        if(err){
          res.send(err);
        }
        else {
          for(var i = 0; i < eventos.length; i++) {
            if(eventos[i].equipo._id == result._id) {
              res.send("No se puede borrar el equipo porque se utiliza en un evento");
            }
          }
          Partido.find({}, 'equipo_local equipo_visitante').
          populate('equipo_local').
          populate('equipo_visitante').
          exec((err, partidos) => {
            if(err){
              res.send(err);
            }
            else if (partidos.length != 0) {
              for(var j = 0; j < partidos.length; j++) {
                if(partidos[j].equipo_local._id == result._id || 
                partidos[j].equipo_visitante._id == result._id) {
                  res.send("No se puede borrar el equipo porque se utiliza en un partido");
                }
                else {
                  result.remove((err) => {
                    if(err) {
                      res.send(err);
                    }
                    else {
                      res.send("Equipo eliminado correctamente");
                    }
                  });
                }
              }
            }
            else {
              result.remove((err) => {
                if(err) {
                  res.send(err);
                }
                else {
                  res.send("Equipo eliminado correctamente");
                }
              });
            }
          });
        }
      });
    }
    else {
      res.send("No se puede borrar el equipo porque se utiliza en otro lado");
    }
  });
});
      

module.exports=router;
