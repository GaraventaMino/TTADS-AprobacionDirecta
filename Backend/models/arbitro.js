var mongoose =require('mongoose');

var arbitroSchema= new mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  edad: {type: Number},
},);

mongoose.model('arbitro', arbitroSchema);