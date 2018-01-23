const express = require('express')
const path = require('path')
const morgan = require('morgan')
const app = express()

const statics = path.join(__dirname, 'build/static')
const staticMountPath = '/static'
const index = path.join(__dirname, 'build', 'index.html')

console.log(statics)
console.log(index)

app.use(morgan('combined'))

app.use(staticMountPath, express.static(statics))

app.get('/*', function (req, res) {
  res.sendFile(index)
})

app.listen(5000)
