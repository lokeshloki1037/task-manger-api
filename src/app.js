const express = require('express')
require('./db/mongoose')
const route = require('../src/router/user');
const routetask = require('../src/router/task')
require('../config/dev.env')

const app = express() 

app.use(express.json());
app.use(route);
app.use(routetask)

module.exports = app