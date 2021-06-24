const homeRouter = require('express').Router()
const Home = require('../models/home')


homeRouter.get('/', (req, res) => {
   Home.findAll()
    .then((makeup) => {
        res.json(makeup)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving makeup')
    })
})

module.exports = homeRouter