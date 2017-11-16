var mongoose =require('mongoose');

var jugadorSchema= new mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  edad: {type: Number},
  goles: {type: Number},
},);

mongoose.model('jugador', jugadorSchema);