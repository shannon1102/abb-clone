'use strict'

const app = require('./server')
const config = require('./config')

app.listen(config.serverSettings.port, () => {
    console.log(`Server list on port ${config.serverSettings.port}`)
})

