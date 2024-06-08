const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET

const createToken = (payload) => jwt.sign(payload, SECRET)

const verifyToken = (token) => jwt.verify(token, SECRET)
 
module.exports = { createToken, verifyToken}