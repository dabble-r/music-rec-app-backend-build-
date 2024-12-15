// Import Mongoose
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log("password needed!")
  process.exit(1)
}

// code to connect to db from MongoDB site
// Encode password for connection string
const password = encodeURIComponent(process.argv[2]);
//'Su41HrJmtSl8TUpo'

// MongoDB Atlas connection URI
const uri = `mongodb+srv://njb_admin:${password}@test1.sdbe3.mongodb.net/Test1?retryWrites=true&w=majority`;

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error:', err));

  // Define a Schema for the Album collection
const albumSchema = new mongoose.Schema({
  album: String,
  artist: String,
  genre: String,
  important: Boolean,
});

// Create a Model from the Schema
const Album = mongoose.model('Album', albumSchema);

// Iterate through DB and find any/all notes(s)
Album.find({}).then(result => {
  result.forEach(album => {
    console.log(album)
  })
  mongoose.connection.close()
})