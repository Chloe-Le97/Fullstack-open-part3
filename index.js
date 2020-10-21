const express = require('express');
const app = express();
app.use(express.json());
var morgan = require('morgan');

// setup the logger 
app.use(morgan('tiny'));

let persons = [
    {
      id: 1,
      name:'Arto Hellas',
      number: '040-1633333'
    },
    {
      id: 2,
      name:'Ada Hellas',
      number: '040-164453'
    },
    {
      id: 3,
      name:'Aro Hellas',
      number: '040-16777333'
    }
  ]
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  app.get('/info',(request,response)=>{
  response.send(`
    <div> Phonebook has info for ${persons.length} people</div>
    <div> ${new Date()}</div>
  `);

  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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

    const Id = Math.random()*1000;
    body.id = Id;

    persons = persons.concat(body)
    response.json(body)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint);

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);
