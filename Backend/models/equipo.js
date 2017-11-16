var mongoose =require('mongoose');

var equipoSchema= new mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  jugadores: [{type: mongoose.Schema.Types.ObjectId, ref: 'jugador'}],
  puntaje: {type: Number},
  tecnico: {type: String, required: true},
  estadio: {type: mongoose.Schema.Types.ObjectId, ref: 'estadio'}
},);

mongoose.model('equipo', equipoSchema);