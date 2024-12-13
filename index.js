const express = require('express')
const app = express()
app.use(express.json())


let albums = [
  {
    id: "1",
    genre: "Jazz",
    important: true
  },
  {
    id: "2",
    genre: "Blues",
    important: false
  },
  {
    id: "3",
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
    const maxId = albums.length > 0
      ? Math.max(...albums.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

  const body = request.body

  if (!body.genre) {
    return response.status(400).json({ 
      error: 'genre missing' 
    })
  }

  const album = {
    genre: body.genre,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  albums = albums.concat(album)

  response.json(album)
})


const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
