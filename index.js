const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors());

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
  }
]


app.get('/', (request, response) => {

  response.send(`<h1>Hello World! and hello world!!</h1>`)
})

app.get('/api/albums', (request, response) => {
  
  response.json(albums)
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
  const id = request.params.id;
  const album = albums.filter(album => album.id === id);
  if (album.length) {
    response.json(album);
  } 
  else {
    response.status(400).send('Not found!');
  }
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
    const album = {
      id: generateId(),
      album: body.album,
      artist: body.artist,
      genre: body.genre,
      important: Boolean(body.important) || false,
    }
  
    albums = albums.concat(album)
  
    response.json(album)
  }
  
})

//logs error message for unknown endpoint request
//app calls function after all routes 
const unknownEndpoint = (request,response) => {
  console.log('custom error message')
  response.status(404).send({ error: 'unknown endpoint' })
};
app.use(unknownEndpoint)

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
