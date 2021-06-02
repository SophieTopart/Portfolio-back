const express = require('express')
const router = express.Router()
const connection = require('../conf')

router.get('/', (req, res) => {
    let sql = 'SELECT * FROM makeup'
    connection.promise().query(sql)
    .then(([results]) => {
        res.json(results)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving makeup')
    })
})

module.exports = router