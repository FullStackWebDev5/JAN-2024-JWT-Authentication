var jwt = require('jsonwebtoken');

const isUserLoggedIn = (req, res, next) => {
  try {
    const { token } = req.headers
    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.user = user
    next()
  } catch (error) {
    return res.json({
      message: "You've not logged in! Please login first"
    })
  }
}

const isUserAdmin = (req, res, next) => {
  const { isAdmin } = req.user
  if(isAdmin) {
    next()
  } else {
    return res.json({
      message: "You're not authorized to access this page"
    })
  }
}

const isUserPremium = (req, res, next) => {
  const { isPremium } = req.user
  if(isPremium) {
    next()
  } else {
    return res.json({
      message: "You're not a premium user. Please upgrade your account first"
    })
  }
}

module.exports = {
  isUserLoggedIn,
  isUserAdmin,
  isUserPremium
}