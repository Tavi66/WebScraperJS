const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    rank:String,
    name:String,
    author:String,
    rating:String,
    price:String //or Int if strip '$'
})

bookSchema.set('toJSON', {
    transform:  (document, returnedObj) => {
      returnedObj.id = returnedObj._id.toString();
      delete returnedObj._id;
      delete returnedObj.__v;
    }
  })

  
module.exports = mongoose.model('Book', bookSchema);