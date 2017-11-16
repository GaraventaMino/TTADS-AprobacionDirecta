var mongoose =require('mongoose');

var estadioSchema= new mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  direccion: {type: String},
},);

mongoose.model('estadio', estadioSchema);