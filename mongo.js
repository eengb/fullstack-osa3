const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    
  })


const Person = mongoose.model('Person', personSchema)

const url =
  `mongodb+srv://eengb:${password}@cluster0.fzgz1.mongodb.net/puhelinluettelo-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

if (process.argv.length<4) {
    Person.find({}).then(result => {
        result.forEach(p => {
          console.log(p)
        })
        mongoose.connection.close()
      })    
  
}else{


const person = new Person({
    name: name,
    number: number,
})

person.save().then(response => {
  console.log('person saved!')
  mongoose.connection.close()
})

}