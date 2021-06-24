const homeRouter = require('./homeRouter')
const makeupRouter = require('./makeupRouter')

const setupRoutes = (app) => {
    app.use('/', homeRouter)
    app.use('/makeup', makeupRouter)
}

module.exports = {
    setupRoutes
}