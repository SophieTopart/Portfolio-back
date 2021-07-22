const projectsRouter = require('./projectsRouter')
const adminRouter = require('./adminRouter')
const loginRouter = require('./loginRouter')


const setupRoutes = (app) => {
    app.use('/projects', projectsRouter)
    app.use('/admin', adminRouter)
    app.use('/login', loginRouter)
}

module.exports = {
    setupRoutes
}