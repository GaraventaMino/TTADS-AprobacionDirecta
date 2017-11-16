var mongoose = require('mongoose');
var Evento = mongoose.model('evento');
var Partido = mongoose.model('partido');
var router=require('express').Router()

//GET ALL
router.get('/', (req, res, next) => {
  Evento.
    find().
    populate('tipo_evento').
    populate('partido').
    populate('equipo').
    populate('jugador').
    exec(function (err, evento) {
      if (err) {
        res.send(err);
      }
      else if(!evento) {
        res.send("Ningún evento encontrado");
      }
      else {
        res.json(evento);
      }
    });
});

//GET ONE
router.get('/:id', (req, res, next) => {
  Evento.
    findOne({_id: req.params.id}).
    populate('tipo_evento').
    populate('partido').
    populate('equipo').
    populate('jugador').
    exec(function (err, evento) {
      if (err) {
        res.send(err);
      }
      else if(!evento) {
        res.send("Ningún evento encontrado");
      }
      else {
        res.json(evento);
      }
    });
});

//CREATE
router.post('/', (req, res, next) => {
  Partido.findOne({_id: req.body.partido}, function(err, correcto){
    if(err){
      res.send(err);
    }
    else if (correcto) {
      if(req.body.tiempo_ocurrencia <= 90 && req.body.tiempo_ocurrencia >= 0) {
        let tiempo_ocurrenciaNuevo = req.body.tiempo_ocurrencia;
        let partidoNuevo = req.body.partido;
        let tipo_eventoNuevo = req.body.tipo_evento;
        let equipoNuevo = req.body.equipo;
        let jugadorNuevo = req.body.jugador;
        var eventoNuevo = new Evento({
          tiempo_ocurrencia: tiempo_ocurrenciaNuevo,
          partido: partidoNuevo,
          tipo_evento: tipo_eventoNuevo,
          equipo: equipoNuevo,
          jugador: jugadorNuevo
        });
        eventoNuevo.save((err, eventoCreado)=> {
          if(err){
            res.send(err);
          }
          else {

          }
        });
      }
    }
    else {
      res.send("No existe ese partido");
    }
  });
});

//UPDATE
router.put('/:id', (req, res, next) =>{
    Evento.findOne({_id: req.params.id},function(err, result){
      if (err) {
        res.status(500).send(err);
      } 
      else if (result) {
        result.tiempo_ocurrencia = req.body.tiempo_ocurrencia || result.tiempo_ocurrencia;
        result.partido = req.body.partido || result.partido;
        result.tipo_evento = req.body.tipo_evento || result.tipo_evento;
        result.equipo = req.body.equipo || result.equipo;
        result.jugador = req.body.jugador || result.jugador;
        result.save((err, resultado) => {
          if(err) {
            res.status(500).send(err)
          }
          else {
            res.status(200).send(resultado);
          }
        });
      }
      else {
        res.send("El evento que quiere modificar no existe");
      }
    });
})


//DELETE ONE
router.delete('/:id', (req, res, next) => {
  Evento.findOne({_id: req.params.id}, function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    else if(result) {                                                                                               
      result.remove((err, deleteEvento) => {
        if(err) {
          res.status(500).send(err);
        }
        res.status(200).send(deleteEvento);
      })
    }
    else {
      res.send("No existe ese Evento");
    }
  });
});

module.exports=router;                                                                                              