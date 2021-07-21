const projectsRouter = require('express').Router()
const Projects = require('../models/projects')


projectsRouter.get('/', (req, res) => {
    Projects.findAll()
    .then((project) => {
        res.json(project)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving projects')
    })
})

/*const makeupRouter = require('express').Router()
const connection = require('../conf')
const Makeup = require('../models/makeup')

const Joi = require('joi');

makeupRouter.get('/:id', (req, res) => {
  Makeup.findOne(req.params.id)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving makeup product')
    })
})

makeupRouter.get('/', (req, res) => {
   Makeup.findByPrice({filters: req.query})
    .then((results) => {
        res.json(results)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving makeup products')
    })
})

makeupRouter.post('/', (req, res) => {
    const error = Makeup.validate(req.body)
    if (error) {
    return res.status(422).json({ validationErrors: error.details })
    } else {
    Makeup.create(req.body)
    .then((createdProduct) => {
        res.status(201).json(createdProduct)        
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error adding makeup product')
    })
}
})

makeupRouter.put('/:id', (req, res) => {
    let existingProduct = null
    let validationErrors = null
    Makeup.findOne(req.params.id)
    .then((makeup) => {
        existingMakeup = makeup
        if (!existingMakeup) return Promise.reject('PRODUCT_NOT_FOUND')
        validationErrors = Makeup.validate(req.body, false)
        if (validationErrors) return Promise.reject('INVALID_DATA')
        return Makeup.update(req.params.id, req.body)
    })
    .then(() => {
        res.status(200).json({...existingProduct, ...req.body})
    })
    .catch((err) => {
        console.error(err)
        if (err === 'PRODUCT_NOT_FOUND')
        res.status(404).send(`Product with id ${productId} not found`)
        else if (err === 'INVALID_DATA')
        res.status(422).json({ validationErrors: validationErrors.details})
        else res.status(500).send('Error updating product')
    })

})

makeupRouter.delete('/:id', (req, res) => {
    Makeup.destroy(req.params.id)
    .then((deleted) => {
        if (deleted) res.status(200).send('🎉 Item deleted')
        else res.status(404).send('Item not found')
    })
     .catch((err) => {
        console.error(err)
        res.status(500).send('Error deleting item')
})
})


module.exports = makeupRouter*/

module.exports = projectsRouter