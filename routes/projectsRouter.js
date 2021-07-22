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

projectsRouter.get('/:id', (req, res) => {
    Projects.findOne(req.params.id)
      .then((result) => {
          res.json(result)
      })
      .catch((err) => {
          console.error(err)
          res.status(500).send('Error retrieving projects')
      })
})
  
projectsRouter.post('/', (req, res) => {
    const error = Projects.validate(req.body)
    if (error) {
    return res.status(422).json({ validationErrors: error.details })
    } else {
    Projects.create(req.body)
    .then((createdProject) => {
        res.status(201).json(createdProject)        
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Error adding project')
    })
}
})


projectsRouter.put('/:id', (req, res) => {
    let existingProject = null
    let validationErrors = null
    Projects.findOne(req.params.id)
    .then((project) => {
        existingProject = project
        if (!existingProject) return Promise.reject('PROJECT_NOT_FOUND')
        validationErrors = Projects.validate(req.body, false)
        if (validationErrors) return Promise.reject('INVALID_DATA')
        return Projects.update(req.params.id, req.body)
    })
    .then(() => {
        res.status(200).json({...existingProject, ...req.body})
    })
    .catch((err) => {
        console.error(err)
        if (err === 'PROJECT_NOT_FOUND')
        res.status(404).send(`Project with id ${req.params.id} not found`)
        else if (err === 'INVALID_DATA')
        res.status(422).json({ validationErrors: validationErrors.details})
        else res.status(500).send('Error updating project')
    })

})

projectsRouter.delete('/:id', (req, res) => {
    Projects.destroy(req.params.id)
    .then((deleted) => {
        if (deleted) res.status(200).send('🎉 Project deleted')
        else res.status(404).send(`Project with id ${req.params.id} not found`)
    })
     .catch((err) => {
        console.error(err)
        res.status(500).send('Error deleting project')
})
})

module.exports = projectsRouter