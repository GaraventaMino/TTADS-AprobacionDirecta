var mongoose =require('mongoose');

var eventoSchema= new mongoose.Schema({
  tiempo_ocurrencia: {type: Number, required: true},
  tipo_evento: {type: mongoose.Schema.Types.ObjectId, ref: 'tipo_evento'},
  partido: {type: mongoose.Schema.Types.ObjectId, ref: 'partido'},
  equipo: {type: mongoose.Schema.Types.ObjectId, ref: 'equipo'},
  jugador: {type: mongoose.Schema.Types.ObjectId, ref: 'jugador'}
},);

mongoose.model('evento', eventoSchema);