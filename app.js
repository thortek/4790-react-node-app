import express from 'express'
import path from 'path'
import { apiRouter } from './routes/api.route.js'
import { movieRouter } from './routes/movie.route.js'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cors from 'cors'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

mongoose.set('useFindAndModify', false);

dotenv.config()

const port = process.env.PORT || 5050

const app = express()

app.use(cors())

app.use(express.urlencoded({extended: true})) // url-encoded !== form-data

app.use(express.json())

//app.use(express.static('public'))

app.use(express.static(path.join(__dirname, '/client/build')))

app.use('/api', apiRouter)

app.use('/movie', movieRouter)

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>')
})

const main = async () => {
    await mongoose.connect(`${process.env.DGM4790_CONNECTION_STRING}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    })
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}

main()