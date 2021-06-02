const express = require('express')
const router = express.Router()
const connection = require('../conf')

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

router.post('/', (req, res) => {
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
})

const Joi = require('joi');

router.patch('/:id', (req, res) => {
    const { error: validationErrors } = Joi.object({
        product: Joi.string().max(255),
        price: Joi.number().min(0)
    }).validate(req.body, { abortEarly: false })

    if (validationErrors)
        return res.status(422).json({ errors: validationErrors.details })

    const sql = 'UPDATE makeup SET ? WHERE id = ?'

    connection.promise()
    .query(sql, [req.body, req.params.id] )
    .then((result) => {
        res.status(200).send('Item updated successfully')
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error updating item')
    })
})

router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM makeup WHERE id = ?'
    connection.promise()
    .query(sql, [req.params.id])
    .then(([result]) => {
        if (result.affectedRows) res.sendStatus(204).send('Item deleted')
        else res.sendStatus(404).send('Item not found')
    })
     .catch((err) => {
        console.error(err)
        res.sendStatus(500).send('Error deleting item')
})
})


module.exports = router