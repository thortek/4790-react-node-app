import { Router } from 'express'

export const productRouter = Router()

import { postAddProduct, getProducts, getProductById, putEditProduct, deleteProduct } from '../controllers/product.controller.js'

productRouter.post('/', postAddProduct)

productRouter.get('/', getProducts)

productRouter.get('/id', getProductById)

productRouter.put('/update', putEditProduct)

productRouter.delete('/delete', deleteProduct)