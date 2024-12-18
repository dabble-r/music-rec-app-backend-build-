//file only as practice/test for returning albums(s)
//file not exported or imported elsewhere

// Import Mongoose
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// code to connect to db from MongoDB site
// MongoDB Atlas connection URI
const uri = process.env.MONGODB_URI
// console.log('uri',uri)

// Connect to MongoDB using Mongoose
mongoose.set('strictQuery',false)
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error:', err))

// Define a Schema for the Album collection
const albumSchema = new mongoose.Schema({
  album: String,
  artist: String,
  genre: String,
  important: Boolean,
})

// Create a Model from the Schema
const Album = mongoose.model('Album', albumSchema)


// Iterate through DB and find any/all notes(s)
Album.find({}).then(result => {
  result.forEach(album => {
    console.log(album)
  })
  mongoose.connection.close()
})

