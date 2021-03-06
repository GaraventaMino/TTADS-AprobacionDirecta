var mongoose =require('mongoose');

var partidoSchema= new mongoose.Schema({
  fecha_hora: {type: Date, required: true},
  equipo_local: {type: mongoose.Schema.Types.ObjectId, ref: 'equipo'},
  equipo_visitante: {type: mongoose.Schema.Types.ObjectId, ref: 'equipo'},
  eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'evento' }],
  arbitro: {type: mongoose.Schema.Types.ObjectId, ref: 'arbitro'},
  estadio: {type: mongoose.Schema.Types.ObjectId, ref: 'estadio'},
  finalizado: {type: Boolean},
  torneo: {type: mongoose.Schema.Types.ObjectId, ref: 'torneo'}
},);

mongoose.model('partido', partidoSchema);