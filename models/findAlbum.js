import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// code to connect to db from MongoDB site
// MongoDB Atlas connection URI
const uri = process.env.MONGODB_URI;
// console.log('uri',uri)

// Connect to MongoDB using Mongoose
mongoose.set('strictQuery',false)
mongoose.connect(uri)
  .then(result => {
    console.log('connected to MongoDB Atlas!')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  
  // Not required for retrieval
  // Define a Schema for the Album collection
const albumSchema = new mongoose.Schema({
  album: {
    type:String,
    required:true
  },
  artist: String,
  genre: String,
  important: Boolean,
});

albumSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Create a Model from the Schema
const Album = mongoose.model('Album', albumSchema);


// Iterate through DB and find any/all notes(s)
Album.find({}).then(result => {
  result.forEach(album => {
    console.log(album)
  })
  //mongoose.connection.close()
})

export default mongoose.model('Album', albumSchema)