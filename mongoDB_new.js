// Import Mongoose
const mongoose = require('mongoose');

// code to connect to db from MongoDB site
// Encode password for connection string
const password = encodeURIComponent('Su41HrJmtSl8TUpo');

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

// Create and save a new album document
const album = new Album({
  album: 'One Size Fits All',
  artist: 'Frank Zappa',
  genre: 'Rock',
  important: true,
});

album.save()
  .then(() => {
    console.log('Album saved!');
    mongoose.connection.close(); // Close the connection after saving
  })
  .catch(err => console.error('Error saving album:', err));
  

  