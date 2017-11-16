var mongoose =require('mongoose');

var jugadorSchema= new mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  edad: {type: Number},
  goles: {type: Number},
  equipo: {type: mongoose.Schema.Types.ObjectId, ref: 'equipo'}
},);

mongoose.model('jugador', jugadorSchema);