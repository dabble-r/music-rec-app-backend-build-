import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import Album from './models/findAlbum.js'

const app = express()
dotenv.config()
app.use(cors());
app.use(express.static('dist'))

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const baseUrl = '/api/albums'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
morgan.token('method', function(req,res) {return JSON.stringify(req.method)})
morgan.token('path', function(req,res) {return JSON.stringify(req.path)})

app.use(express.json())
app.use(morgan(':method :path :body :date[web]'))


//logs requests for HTTP requests
const requestLogger = (request, response, next) => {
  console.log("method", request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
};
//app.use(requestLogger)


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
 

app.get('/api/info', (request, response) => {
  const length = albums.length;
  const timestamp = new Date();
  response.send(
  `<div>
    <p>The music library has `+ length + `albums available.</p>
    <p>The access time is ` + timestamp + `</p>
  </div>`)
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
      console.log(error)
      const idArr = request.params.id.split('');
      response.status(400).send(
        {
          error: `${request.params.id} is a malformed ID. 
          Must be ${24 - idArr.length} digits longer.`
      })
    })
})


app.delete('/api/albums/:id', (request, response) => {
  const id = request.params.id
  albums = albums.filter(album => album.id !== id)

  response.status(204).end()
})


app.post('/api/albums', (request, response) => {
  const generateId = () => {
    let rand = Math.round(Math.random() * 1000);
    const id = albums.length == 0 ? 1 : rand;
    return String(id)
  }

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
        id: generateId(),
        album: body.album,
        artist: body.artist,
        genre: body.genre,
        important: Boolean(body.important) || false,
      }
    )
  
    album.save().then(savedAlbum => {
      response.json(savedAlbum)})
  }
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
