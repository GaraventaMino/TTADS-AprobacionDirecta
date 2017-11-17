var mongoose =require('mongoose');

var estadioSchema= new mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  direccion: {type: String},
  equipo: {type: mongoose.Schema.Types.ObjectId, ref: 'equipo'},
  imagen: {type: String}
},);

mongoose.model('estadio', estadioSchema);