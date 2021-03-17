import express from 'express'
//import bodyParser from 'body-parser'
import { apiRouter } from './routes/api.route.js'
import { productRouter } from './routes/product.route.js'
import { movieRouter } from './routes/movie.route.js'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cors from 'cors'

mongoose.set('useFindAndModify', false);

dotenv.config()

const port = process.env.PORT || 5050

const app = express()

app.use(cors())

app.use(express.urlencoded({extended: true})) // url-encoded !== form-data

app.use(express.json())

app.use(express.static('public'))

app.use('/api', apiRouter)

app.use('/product', productRouter)

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