const mongoose = require('mongoose');

let name = process.argv[3];
let number = process.argv[4];

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Chloe:${password}@cluster0.17p9e.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phoneSchema)

const phonebook = new Phonebook({
  name: name,
  number: number,
})

phonebook.save().then(result => {
  console.log(`Added ${name} ${number} to phonebook`)
  mongoose.connection.close()
})

if (process.argv.length == 3) {
    Phonebook.find({}).then(result => {
        result.forEach(number => {
          console.log(`${number.name} ${number.number}`)
        })
        mongoose.connection.close();
        process.exit(1)
      })
}