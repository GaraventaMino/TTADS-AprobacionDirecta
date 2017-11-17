var mongoose =require('mongoose');

var tipo_eventoSchema= new mongoose.Schema({
  nombre: {type: String, required: true},
  icono: {type: String}
},);

mongoose.model('tipo_evento', tipo_eventoSchema);