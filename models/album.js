
import mongoose from 'mongoose'

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
})

albumSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Album = mongoose.model('Album', albumSchema)

export default Album
