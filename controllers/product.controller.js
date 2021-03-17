import { Product } from '../models/product.js'

export const postAddProduct = ((req, res) => {
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    })
    console.log(product)
    product.save() // save method is provided by Mongoose
    res.json(product)
})

/* export const getAllProducts = ((req, res) => {
    Product.find()
        .then(products => {
        res.json(products)
        })
    .catch(err => console.log(err))
}) */

export const getProducts = async (req, res) => {
    const products = await Product.find()
    res.json(products)
}

export const getProductById = async (req, res) => {
    const prodId = req.body.productId
    console.log(prodId)
    try {
        const product = await Product.findById(prodId)
        if (!product) {
            return res.status(404).json({ Message: 'Product not Found' })
        }
        res.json(product)
    } catch(err) {
        res.status(400).json({Message: `Invalid ID: ${err}`})
    }
}

export const putEditProduct = async (req, res) => {
    const prodId = req.body.productId
    const updatedObj = {
        title: req.body.title,
        price: req.body.price, // typeof ? (if string then parsed by Mongoose, else number by body-parser)
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    }
    try {
        const product = await Product.findByIdAndUpdate(prodId, updatedObj, { new: true })
        res.json(product)
    } catch (err) {
        res.status(400).json({Message: `Could not update: ${err}`})
    }
}

export const deleteProduct = async (req, res) => {
    const prodId = req.body.productId
    try {
        const deletedProduct = await Product.findByIdAndRemove(prodId)
        if (!deletedProduct) {
            return res.status(400).json({Message: `Product to delete not found.`})
        }
        console.log(`Deleted the product: ${deletedProduct}`)
        //res.redirect(`/product`) // return all products
        res.sendStatus(200) // a simple success
    } catch (err) {
        res.status(400).json({Message: `Invalid ID: ${err}`})
    }

}