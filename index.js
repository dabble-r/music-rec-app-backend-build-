import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import Album from './models/findAlbum.js'
import mongoose from 'mongoose'

const app = express()
dotenv.config()
app.use(cors());
app.use(express.static('dist'))
app.use(express.json())

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const baseUrl = '/api/albums'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
morgan.token('method', function(req,res) {return JSON.stringify(req.method)})
morgan.token('path', function(req,res) {return JSON.stringify(req.path)})

app.use(morgan(':method :path :body :date[web]'))


// logs requests for HTTP requests
const requestLogger = (error, request, response, next) => {
  console.log("method", request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  
  next()
};
app.use(requestLogger)


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let albums = [
  {
    id: "1",
    album: "Kind of Blue",
    artist: "Miles Davis",
    genre: "Jazz",
    important: true
  },
  {
    id: "2",
    album: "The Sky is Crying",
    artist: "Stevie Ray Vaughan & Double Trouble",
    genre: "Blues",
    important: false
  },
  {
    id: "3",
    album: "Led Zeppelin II",
    artist: "Led Zeppelin",
    genre: "Rock",
    important: true
  },
  {
    id: "4",
    album: "Led Zeppelin III",
    artist: "Led Zeppelin",
    genre: "Rock",
    important: true
  },
  {
    id: "5",
    album: "Led Zeppelin IV",
    artist: "Led Zeppelin",
    genre: "Rock",
    important: true
  }
]

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// code to connect to db from MongoDB site

///////////////////////////////////////////////////////////////

// Redundant Code
// GET request imported from models/findAlbum.js
// MongoDB Atlas connection URI
/*
const uri = process.env.MONGODB_URI;
console.log('uri:',uri)

// Connect to MongoDB using Mongoose
mongoose.set('strictQuery',false)
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
*/

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/albums', (request, response) => {
  Album.find({}).then(albums => {
    response.json(albums)
  })
})
 

app.get('/api/info', async (request, response) => {
  try {
     // Get the count of documents asynchronously
     const len = await Album.countDocuments();
     const timestamp = new Date();

     // Send the response with the count and timestamp
    response.send(
      `<div>
        <p>The music library has ${len} albums available.</p>
        <p>The access time is ${timestamp}</p>
      </div>`
    )}
  catch (error) {
    console.error('Error fetching album count:', error.message);
    response.status(500).send('An error occurred while fetching the album count.');
  }
})

/*
// error handling within HTTP method
app.get('/api/albums/:id', (request, response) => {
  Album.findById(request.params.id)
    .then(album => {
      response.json(album)
  })
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      const idArr = request.params.id.split('');
      console.log(error)
      response.status(400).send(
        {
          error: `${request.params.id} is a malformed ID. 
          Must be ${24 - idArr.length} digits longer.`
      })
    })
})
*/

// error handling centralized to middleware
// passed to next function/parameter
app.get('/api/albums/:id', (request, response, next) => {
  Album.findById(request.params.id)
    .then(album => {
      response.json(album)
  })
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/api/albums/:id', (request, response) => {
  Album.findById(request.params.id)
    .then(album => {
      response.json(album)
  })
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      const idArr = request.params.id.split('');
      console.log(error)
      response.status(400).send(
        {
          error: `${request.params.id} is a malformed ID. 
          Must be ${24 - idArr.length} digits longer.`
      })
    })
})


app.delete('/api/albums/:id', (request, response, next) => {
  Album.findById(request.params.id)
   .then(album => {
    if (!album) {
      console.log('Album doesn\'t exist!')
      response.status(200).send('Album already deleted!')
    } 
    else {
      Album.findByIdAndDelete(request.params.id)
        .then(result => {
        console.log('Album deleted!')
        response.status(200).send("Album deleted!")
      })
        .catch(error => next(error))
    }
  })   
})


app.post('/api/albums', (request, response, next) => {
  const body = request.body
  let duplicates = albums.filter(el => el['album'] == body.album)
  
  if (!body.genre) {
    return response.status(400).json({ 
      error: 'genre missing' 
    })
  }
  if (duplicates.length) {
    return response.status(400).json({ 
      error: 'album exists!' 
    })
  }
  else {
    const album = new Album (
      {
        id: null,
        album: body.album,
        artist: body.artist,
        genre: body.genre,
        important: Boolean(body.important) || false,
      }
    )
    const error = album.validateSync();
    console.log(error)
    album.save()
      .then(savedAlbum => {
      response.json(savedAlbum)})
      .catch(errpr => {
        next(error)
      })
  }
})

app.put('/api/albums/:id', (request, response, next) => {
  const body = request.body;
  const { album, artist, genre } = request.body;

  /*
  const album = {
    album : body.album,
    artist : body.artist,
    genre : body.genre,
    important: body.important,
    id: ""
  }
  */

  Album.findByIdAndUpdate(
    request.params.id, 
    { album, artist, genre },  
    { new: false,
      runValidators: true,
      context: 'query'
    })
    .then(updatedAlbum => {
      response.json(updatedAlbum)
  })
    .catch(error => next(error))
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//logs error message for unknown endpoint request
//app calls function after all routes 
const unknownEndpoint = (request,response) => {
  console.log('custom error message')
  response.status(404).send({ error: 'unknown endpoint' })
};
app.use(unknownEndpoint)


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
