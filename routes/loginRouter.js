const express = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/admin')
const db = require('../conf')
const checkAuthFields = require('../middlewares/check-fields')
const checkJwt = require('../middlewares/check-jwt')

const loginRouter = express.Router()
const isProduction = process.env.NODE_ENV === 'production'

require('dotenv').config()

loginRouter.post('/', checkAuthFields, (req, res) => {
  const { username, password } = req.body

  db.query('SELECT * FROM admin WHERE username = ?', username, (err, results) => {

const [user] = results

    User.verifyPassword(password, user.password, (err))
      .then((passwordIsCorrect) => {
        if (err) {
          console.log(err.message)
        }
        if (!passwordIsCorrect) {
          res.status(400).json({
            errors: 'invalid password'
          })
        } else {
          const { id } = user
          const payload = { id, username }
          const privateKey = process.env.JWT_SECRET


          jwt.sign(
            { payload },
            privateKey,
            (jwterr, token) => {
              if (jwterr) {
                return res.status(500).json({
                  errors: [jwterr.message]
                })
              }
              console.log(token)
              const options = {
                httpOnly: true,
                expiresIn: '1h',
                secure: isProduction
              }
              res.cookie('jwt', token, options)
              res.json({ payload })
            }
          );
        }
      })
  })
})

loginRouter.get('/check', checkJwt, (req, res) => {
  res.json(req.user)
})

module.exports = loginRouter