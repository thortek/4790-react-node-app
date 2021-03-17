import { Router } from 'express'

export const apiRouter = Router()

import { api, status } from '../controllers/api.controller.js'

apiRouter.use('/', (req, res, next) => {
    console.log(`You just hit my custom middleware for api: ${new Date().toLocaleString()}`)
    next()
})

apiRouter.get('/', api)

apiRouter.get('/status', status)
