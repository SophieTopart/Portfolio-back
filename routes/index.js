const projectsRouter = require('./projectsRouter')

const setupRoutes = (app) => {
    app.use('/projects', projectsRouter)
}

module.exports = {
    setupRoutes
}