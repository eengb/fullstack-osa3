require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')

const cors = require('cors')

app.use(cors())



app.use(express.static('build'))


const errorHandler = (error,request,response,next) => {
  console.error(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}








let persons = [
  {
    id: 1,
    name: "Pepe Helenius",
    number: "040123"
  },
  {
    id: 2,
    name: "Hilla Engblom",
    number: "040987"
  },
  {
    id: 3,
    name: "Vilma Kokkonen",
    number: "040654"
  },
  {
    id: 4,
    name: "Rasmus Engblom",
    number: "040019"
  }
]

app.use(express.json())


morgan.token('content',(req) => {
  return JSON.stringify(req.body) 
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

  //app.use(morgan('tiny')) 

  app.get('/info', (req, res) => {
    const datetime = new Date()
    Person.find({}).then(persons =>{
    res.send(`<p> Phonebook has info for ${persons.length} people </p>
              <p> ${datetime}  </p>`)
  })
  
  })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons =>{
    res.json(persons)

  })
      
})

app.get('/api/persons/:id', (req,res, next) =>{
  
  Person.findById(req.params.id)
  .then(person =>{
    res.json(person)})
  .catch(error => next(error))    
}) 




app.delete('/api/persons/:id', (req,res, next) =>{
  Person.findByIdAndRemove(req.params.id)
  
  .then(result => {
    if (result){
    
    res.status(204).end()

    }else{
    res.status(404).end()
    }

  })
  .catch(error => next(error))
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

 

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true,runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson===null){
        return response.status(404).send({ error: 'Person allready deleted' })

      }else{
        response.json(updatedPerson)
      }
      
       
   
      
     
    })
    .catch(error => next(error))
})



const generateRandomId = () => {
   const randomId = Math.floor(Math.random() * 1000)
   return (randomId)  
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  



  const person = new Person({
    id: generateRandomId(),
    name: body.name,
    number: body.number, 
  })

  if (persons.find( p => p.name === body.name)){

    return response.status(400).json({ 
      error: 'name is allready in phonebook'})
    }


    person.save()
    .then(savedPerson => {
      response.json(savedPerson)})
    .catch(error => next(error))

})



app.use(errorHandler)


  const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })