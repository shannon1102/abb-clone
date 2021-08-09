'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const swaggerUI = require('swagger-ui-express')
// logging
const logger = require('./logger')

require('dotenv').config({path: path.join(__dirname, '.env')})

const app = express()
app.use(cors())
// app.use(morgan('dev'))
app.use(morgan('combined', {
    stream: logger.stream
}))

app.use(bodyParser.json())
app.use(helmet())

const backendRoute = express.Router()

const postApi = require('./apis/routes/postApi/postApi')
const productApi = require('./apis/routes/productApi/productApi')
const contactApi = require('./apis/routes/contactApi/contactApi')
const socialApi = require('./apis/routes/socialApi/socialApi')
const componentApi = require('./apis/routes/componentApi/componentApi')

backendRoute.use('/posts', postApi)
backendRoute.use('/products',productApi)
backendRoute.use('/contacts',contactApi)
backendRoute.use('/social',socialApi)
backendRoute.use('/components',componentApi)

const swaggerDocument = require('./swagger.json')
backendRoute.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/backend', backendRoute)

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} -${req.method} - ${req.ip}`)

    // render the error page
    res.status(err.status || 500)
    // res.render('error')
    res.send(err)
})

module.exports = app
