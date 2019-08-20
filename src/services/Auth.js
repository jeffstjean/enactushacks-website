const jwt = require('jsonwebtoken')

module.exports.isAuthenticated = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies)
  if (decoded) {
    req.user = decoded
    next()
  } else {
    next({ name: 'UnauthorizedError', status: 401, message: 'You must be logged in to view this page' })
  }
}

module.exports.isParticipant = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies)
  console.log(decoded)
  if (decoded && (decoded.role === 'participant' || decoded.role === 'admin' || decoded.role === 'developer')) {
    req.user = decoded
    next()
  } else {
    res.status(401).send('cant be here')
  }
}

module.exports.isAdmin = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies)
  if (decoded && (decoded.role === 'admin' || decoded.role === 'developer')) {
    req.user = decoded
    next()
  } else {
    res.status(401).send('cant be here')
  }
}

module.exports.isDeveloper = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies)
  if (decoded && decoded.role === 'developer') {
    req.user = decoded
    next()
  } else {
    res.status(401).send('cant be here')
  }
}

const verifyTokenFromCookies = (cookies) => {
  if (!cookies.token) return null
  try {
    console.log('checking token')
    var oldToken = jwt.verify(cookies.token, process.env.JWT_SECRET)
    return oldToken
  } catch { return null }
}

module.exports.verifyTokenFromCookies = verifyTokenFromCookies
