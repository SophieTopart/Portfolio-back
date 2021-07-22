const adminRouter = require('express').Router()
const Admin = require('../models/admin')
const db = require('../conf')
const checkAuthFields = require('../middlewares/check-fields')

adminRouter.get('/', (req, res) => {
    Admin.findAll()
    .then((user) => {
        res.json(user)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error retrieving users')
    })
})

adminRouter.get('/:id', (req, res) => {
    Admin.findOne(req.params.id)
      .then((result) => {
          res.json(result)
      })
      .catch((err) => {
          console.error(err)
          res.status(500).send('Error retrieving user')
      })
})

/*adminRouter.get('/', (req, res) => {
    Admin.findByUsername({filters: req.query})
      .then((result) => {
          res.json(result)
      })
      .catch((err) => {
          console.error(err)
          res.status(500).send('Error retrieving user')
      })
})*/

/*adminRouter.post('/', checkAuthFields, (req, res) => {
    const { username, password } = req.body
    const error = Admin.validate(req.body)

    let existingUser = null
    let validationErrors = null
    Admin.findByUsername(req.params.username)
    .then((user) => {
        existingUser = user
        if (existingUser) return Promise.reject('DUPLICATE_USERNAME')
        validationErrors = Admin.validate(req.body, false)
        if (validationErrors) return Promise.reject('INVALID_DATA')
        return Admin.hashPassword(password).then((hashedPassword) => {
            console.log(username, password)
        
            const newUser = {
              username,
              password: hashedPassword
            }
        
            db.query('INSERT INTO admin SET ?', newUser, (err, result) => {
              if (err) {
                return res.status(500).json({
                  errors: [err.message]
                })
              }
              res.status(201).json({
                id: result.insertId,
                username,
                password: hashedPassword
              })
            })
          })
    })
    .catch((err) => {
        console.error(err)
        if (err === 'DUPLICATE_USERNAME')
        res.status(404).send(`Username ${req.params.username} already exists`)
        else if (err === 'INVALID_DATA')
        res.status(422).json({ validationErrors: validationErrors.details})
        else res.status(500).send('Error updating user')
    })

    if (error) {
    return res.status(422).json({ validationErrors: error.details })
    } 
    else {
        Admin.hashPassword(password).then((hashedPassword) => {
            console.log(username, password)
        
            const newUser = {
              username,
              password: hashedPassword
            }
        
            db.query('INSERT INTO admin SET ?', newUser, (err, result) => {
              if (err) {
                return res.status(500).json({
                  errors: [err.message]
                })
              }
              res.status(201).json({
                id: result.insertId,
                username,
                password: hashedPassword
              })
            })
          })
    }
  })*/
  

adminRouter.post('/', checkAuthFields, (req, res) => {
    const { username, password } = req.body
    const error = Admin.validate(req.body)
    if (error) {
    return res.status(422).json({ validationErrors: error.details })
    } 
    

    else {
        Admin.hashPassword(password).then((hashedPassword) => {
            console.log(username, password)
        
            const newUser = {
              username,
              password: hashedPassword
            }
        
            db.query('INSERT INTO admin SET ?', newUser, (err, result) => {
              if (err) {
                return res.status(500).json({
                  errors: [err.message]
                })
              }
              res.status(201).json({
                id: result.insertId,
                username,
                password: hashedPassword
              })
            })
          })
    }
  })

  adminRouter.put('/:id', (req, res) => {
    let existingUser = null
    let validationErrors = null
    Admin.findOne(req.params.id)
    .then((user) => {
        existingUser = user
        if (!existingUser) return Promise.reject('USER_NOT_FOUND')
        validationErrors = Admin.validate(req.body, false)
        if (validationErrors) return Promise.reject('INVALID_DATA')
        return Admin.update(req.params.id, req.body)
    })
    .then(() => {
        res.status(200).json({...existingUser, ...req.body})
    })
    .catch((err) => {
        console.error(err)
        if (err === 'USER_NOT_FOUND')
        res.status(404).send(`User with id ${req.params.id} not found`)
        else if (err === 'INVALID_DATA')
        res.status(422).json({ validationErrors: validationErrors.details})
        else res.status(500).send('Error updating user')
    })

})

  adminRouter.delete('/:id', (req, res) => {
    Admin.destroy(req.params.id)
    .then((deleted) => {
        if (deleted) res.status(200).send('User deleted')
        else res.status(404).send(`User with id ${req.params.id} not found`)
    })
     .catch((err) => {
        console.error(err)
        res.status(500).send('Error deleting user')
})
})


module.exports = adminRouter