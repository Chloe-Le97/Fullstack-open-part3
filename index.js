require('dotenv').config();

const express = require('express');
const app = express();

const Phonebook = require('./models/phonebook');

app.use(express.json());
var morgan = require('morgan');
const mongoose = require('mongoose');

app.use(express.static('build'));

const cors = require('cors');
app.use(cors());

// setup the logger 
app.use(morgan('tiny'));



  let persons = [];

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(numbers =>{
      response.json(numbers)
    })
  })
  
  app.get('/info',(request,response)=>{
  response.send(`
    <div> Phonebook has info for ${persons.length} people</div>
    <div> ${new Date()}</div>
  `);

  })

  app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id).then(number=>{
      if (number) {
        response.json(number)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })


  app.post('/api/persons', (request, response) => {
    var body = request.body;
    if(!body.name){
       return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if(!body.number){
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    var duplicate = persons.filter((item) => item.name==body.name)

    if(duplicate.length>0){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    const phonebook = new Phonebook({
      name: body.name,
      number: body.number,
    })
    
    phonebook.save().then(result => {
      response.json(result)
    })

  })

  app.delete('/api/persons/:id', (request, response) => {
    Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      name: body.name,
      number: body.number,
    }
  
    Phonebook.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNumber => {
        response.json(updatedNumber)
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint);
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)


  const port = process.env.PORT
  app.listen(port, () => {
      console.log(`Server running on port ${port}`)
  })
