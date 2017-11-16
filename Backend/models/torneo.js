var mongoose =require('mongoose');

var torneoSchema= new mongoose.Schema({
  nombre: {type: String, required: true},
  partidos: [{type: mongoose.Schema.Types.ObjectId, ref: 'partido'}],
  equipos: [{type: mongoose.Schema.Types.ObjectId, ref: 'equipo'}],
});

mongoose.model('torneo', torneoSchema);