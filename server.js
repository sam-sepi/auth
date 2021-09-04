//EXPRESS INIT.
const express = require('express')
const app = express()

//HELMET - Helmet helps you secure your Express apps by setting various HTTP headers.
var helmet = require('helmet');
app.use(helmet())

//XSS CLEAN init
var xss = require('xss-clean')
app.use(xss()) //make sure this comes before any routes -> XSS prevent

//DB CONN
require('./src/db/db-connect')

//PORT
const PORT = 3008

//JSON 
app.use(express.json({ limit: '10kb' })); // Body limit is 10 -> DoS prevent


//USER ROUTING
const userRouter = require('./src/routers/user')
app.use(userRouter)

/***
 * SERVER
 */

//SERVER LISTEN
app.listen(PORT, () => console.log('Server ready'))