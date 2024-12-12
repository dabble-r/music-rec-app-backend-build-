const http = require('http')

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

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(genres))
})

const PORT = 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)