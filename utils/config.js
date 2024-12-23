import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3002
const MONGODB_URI = process.env.MONGODB_URI

export { MONGODB_URI, PORT }