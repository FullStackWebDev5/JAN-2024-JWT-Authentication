const bcrypt = require('bcrypt');
const User = require('../models/users.js')
var jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json({
      status: 'SUCCESS',
      data: users
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
}

const signupUser = async (req, res) => {
  try {
    const { name, email, password, isPremium, isAdmin } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.create({ 
      name, 
      email, 
      password: encryptedPassword, 
      isPremium, 
      isAdmin 
    })
    res.json({
      status: 'SUCCESS',
      message: 'User signed up successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()

    if(!user) {
      return res.json({
        status: 'FAILED',
        message: 'User with this email does not exist. Please sign up first.'
      })
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password)

    if(!doesPasswordMatch) {
      return res.json({
        status: 'FAILED',
        message: 'Incorrect credentials'
      })
    }

    const jwToken = jwt.sign(user, process.env.JWT_PRIVATE_KEY, { expiresIn: 60 })

    res.json({
      status: 'SUCCESS',
      message: 'User logged in successfully',
      token: jwToken
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
}

module.exports = {
  getUsers,
  signupUser,
  loginUser
}