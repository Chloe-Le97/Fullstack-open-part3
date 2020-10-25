const mongoose = require('mongoose');

const url = 'mongodb+srv://Chloe:19021997@cluster0.17p9e.mongodb.net/phonebook?retryWrites=true&w=majority'

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Phonebook', phoneSchema);