//file only as practice/test for returning albums(s)
//file not exported or imported elsewhere

// Import Mongoose
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// code to connect to db from MongoDB site

// MongoDB Atlas connection URI
const uri = process.env.MONGODB_URI

// Connect to MongoDB using Mongoose
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

//transform album schema
albumSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Create a Model from the Schema
const Album = mongoose.model('Album', albumSchema)

// Create and save a new album document
const album = new Album({
  album: 'One Size Fits All - test3',
  artist: 'Frank Zappa',
  genre: 'Rock',
  important: true,
})



album.save()
  .then(() => {
    console.log('Album saved!')
    mongoose.connection.close() // Close the connection after saving
  })
  .catch(err => console.error('Error saving album:', err))
  

  