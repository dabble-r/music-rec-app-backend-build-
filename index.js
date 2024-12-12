const express = require('express')
const app = express()

let genres = [
  {
    id: "1",
    content: "Jazz",
    important: true
  },
  {
    id: "2",
    content: "Blues",
    important: false
  },
  {
    id: "3",
    content: "Rock",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send(`<h1>Hello World!</h1>`)
})

app.get('/api/notes', (request, response) => {
  response.json(genres)
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
