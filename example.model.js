const mongoose = require('mongoose');

var exampleSchema = new mongoose.Schema({
    name:{type: String,required:true,unique:true},
    price:{type: String,required:true},
    description:{type: String}
},{collection: 'example'});


mongoose.model('example',exampleSchema);