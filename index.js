const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')

app.use(cors())



app.use(express.static('build'))



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
  
  if (req.method === 'POST'){
  return JSON.stringify(req.body)
  }else{
    return req.body
  }
})


  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

  //app.use(morgan('tiny')) 

app.get('/info', (req, res) => {
  const datetime = new Date()
  res.send(`<p> Phonebook has info for ${persons.length} people </p>
            <p> ${datetime}  </p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req,res) =>{
  const id = Number(req.params.id)
  const person = persons.find( p => p.id === id)

  if (person){
    res.json(person)

  } else {
    res.status(404).end()
  }

} )



app.delete('/api/persons/:id', (req,res) =>{
  const id = Number(req.params.id)
  persons = persons.filter( p => p.id !== id)
  res.status(204).end()
})



const generateRandomId = () => {
   const randomId = Math.floor(Math.random() * 1000)
   return (randomId)  
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  

  if (!body.name || !body.number ) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number, 
  }

  if (persons.find( p => p.name === body.name)){

    return response.status(400).json({ 
      error: 'name is allready in phonebook'})
    }


  


  persons = persons.concat(person)
  response.json(person)
  })





  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })