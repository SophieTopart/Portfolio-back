require('dotenv').config();
const jwt = require('jsonwebtoken')

const checkJwt = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const privateKey = process.env.JWT_SECRET

  if (!token) {
    return res.sendStatus(401).json({ error: 'no token' })
  }

  return jwt.verify(token, privateKey, (err, payload) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.user = payload
    return next()
  });
}

module.exports = checkJwt