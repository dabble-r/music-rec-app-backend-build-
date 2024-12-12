const express = require('express')
const app = express()

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

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
