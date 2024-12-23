import express from 'express'
import Album from '../models/album.js'

const albumsRouter = express.Router()

/*
albumsRouter.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
*/

albumsRouter.get('/', (request, response) => {
  Album.find({}).then(albums => {
    response.json(albums)
  })
})
 

albumsRouter.get('/info', async (request, response) => {
  try {
    // Get the count of documents asynchronously
    const len = await Album.countDocuments()
    const timestamp = new Date()

    // Send the response with the count and timestamp
    response.send(
      `<div>
        <p>The music library has ${len} albums available.</p>
        <p>The access time is ${timestamp}</p>
      </div>`
    )}
  catch (error) {
    console.error('Error fetching album count:', error.message)
    response.status(500).send('An error occurred while fetching the album count.')
  }
})

// error handling centralized to middleware
// passed to next function/parameter
albumsRouter.get('/:id', (request, response, next) => {
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


albumsRouter.get('/:id', (request, response) => {
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
      const idArr = request.params.id.split('')
      console.log(error)
      response.status(400).send(
        {
          error: `${request.params.id} is a malformed ID. 
          Must be ${24 - idArr.length} digits longer.`
        })
    })
})


albumsRouter.delete('/:id', (request, response, next) => {
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
            response.status(200).send('Album deleted!')
          })
          .catch(error => next(error))
      }
    })   
})


albumsRouter.post('/', (request, response, next) => {
  const body = request.body
  //let duplicates = body.filter(el => el['album'] == body.album)
  
  if (!body.genre) {
    return response.status(400).json({ 
      error: 'genre missing' 
    })
  }
  /*
  if (duplicates.length) {
    return response.status(400).json({ 
      error: 'album exists!' 
    })
  }
  */
  const album = new Album (
    {
      id: null,
      album: body.album,
      artist: body.artist,
      genre: body.genre,
      important: Boolean(body.important) || false,
    })
  const error = album.validateSync()
  console.log(error)
  album.save()
    .then(savedAlbum => {
      response.json(savedAlbum)})
    .catch(error => {
      next(error)
    })
})

albumsRouter.put('/:id', (request, response, next) => {
  //const body = request.body
  const { album, artist, genre } = request.body
  const id = request.params.id
  if (id.length < 24) {
    response.status(400).send('Album ID must be 24 digits!')
  }
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

export default albumsRouter