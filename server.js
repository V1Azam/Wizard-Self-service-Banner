const express = require('express')
const app = express()

app.use(express.static('Client'));

app.listen(8090)