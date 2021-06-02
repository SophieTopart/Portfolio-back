const express = require("express")
const app = express()
const port = process.env.PORT || 8000
const connection = require("./conf")
const morgan = require('morgan')

const homeRouter = require('./routes/homeRouter')
const makeupRouter = require('./routes/makeupRouter')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(cors)

app.use('/', homeRouter)
app.use('/makeup', makeupRouter)

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to DB')
    } else {
        console.log('Connected to DB')
    }
})

app.listen(port, (err) => {
    if(err){
        throw new Error("Something bad happened")
    }
    console.log(`Server is listening on port ${port}`)
})