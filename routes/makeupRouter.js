const express = require('express')
const router = express.Router()
const connection = require('../conf')

const Joi = require('joi');

router.get('/:id', (req, res) => {
    const { id } = req.params
    let sql = 'SELECT * FROM makeup WHERE id = ?'
    connection.promise().query(sql, [id])
    .then(([results]) => {
        res.json(results)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving makeup product')
    })
})

router.get('/', (req, res) => {
    const { max_price } = req.query
    let sql = 'SELECT * FROM makeup WHERE price <= ?'
    connection.promise().query(sql, [max_price])
    .then(([results]) => {
        res.json(results)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving makeup products')
    })
})

const validationUserInput = (req, res) => {
  
}

router.post('/', (req, res) => {
    const { error: validationErrors } = Joi.object({
        product: Joi.string().max(255),
        price: Joi.number().min(0)
    }).validate(req.body, { abortEarly: false })
    if (validationErrors) {
    return res.status(422).json({ errors: validationErrors.details })
    } else {
    const { product, price } = req.body
    let sql = 'INSERT INTO makeup(product, price) VALUES (?, ?)'
    connection.promise()
    .query(sql, [product, price])
    .then(([result]) => {
        const createdProduct = { id: result.insertId, product, price }
        res.json(createdProduct)        
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error adding makeup product')
    })
}
})

router.put('/:id', (req, res) => {
    const { error: validationErrors } = Joi.object({
        product: Joi.string().max(255),
        price: Joi.number().min(0)
    }).validate(req.body, { abortEarly: false })
    if (validationErrors) {
    return res.status(422).json({ errors: validationErrors.details })
    } else {
    const productId = req.params.id
    let existingProduct = null
    let selectSql = 'SELECT * FROM makeup WHERE id = ?'
    let updateSql = 'UPDATE makeup SET ? WHERE id = ?'
    connection.promise()
    .query(selectSql, [productId])
    .then(([results]) => {
        existingProduct = results[0]
        if (!existingProduct) return Promise.reject('PRODUCT_NOT_FOUND')
        return connection.promise().query(updateSql, [req.body, productId])
    })
    .then(() => {
        res.status(200).json({...existingProduct, ...req.body})
    })
    .catch((err) => {
        console.error(err)
        if (err === 'PRODUCT_NOT_FOUND')
        res.status(404).send(`Product with id ${productId} not found`)
        else res.status(500).send('Error updating product')
    })
}
})

router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM makeup WHERE id = ?'
    connection.promise()
    .query(sql, [req.params.id])
    .then(([result]) => {
        if (result.affectedRows) res.status(204).send('Item deleted')
        else res.status(404).send('Item not found')
    })
     .catch((err) => {
        console.error(err)
        res.status(500).send('Error deleting item')
})
})


module.exports = router