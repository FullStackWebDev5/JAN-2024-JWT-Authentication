const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./src/routes/users.js')
const { 
  isUserLoggedIn,
  isUserAdmin,
  isUserPremium
} = require('./src/middlewares/users.js')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(userRoutes)

app.get('/', (req, res) => {
  res.send({
    status: 'Server is up :)',
    now: new Date()
  })
})

app.get('/dashboard', (req, res) => {
  res.send('DASHBOARD PAGE')
})

app.get('/profile', isUserLoggedIn, (req, res) => {
  res.send('PROFILE PAGE: ' + req.user.name + ' | ' + req.user.email)
})

app.get('/admin-dashboard', isUserLoggedIn, isUserAdmin, (req, res) => {
  res.send('ADMIN PAGE')
})

app.get('/premium-content', isUserLoggedIn, isUserPremium, (req, res) => {
  res.send('PREMIUM CONTENT PAGE')
})

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('Server is running :)'))
    .catch((error) => console.log(error))
})














/*
  # Authentication vs Authorization
    - Authentication: Who are you?
    - Authorization: What access do you have?

    - Private Route
      - Can be accessed only by logged in users (Authentication)
      - Can be accessed only by authorized users (Authorization)
        - Admin Dashboard
        - Premium Content

  # Encryption/Decryption
    - Encryption: Original Password -> Encrypted Password
    - Decryption: Encrypted Password -> Original Password

    - Eg:
      - Encryption Rule: N+3
        - Original Password: meet123r
        - Encrypted Password: phhw456u
      - Decryption Rule: N-3
        - Encrypted Password: phhw456u
        - Original Password: meet123r

  # Packages
    - bcrypt
    - jsonwebtoken

  # Resources
    - https://blog.logrocket.com/using-axios-set-request-headers/
*/