const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('yawara-token')
    if (!token) return res.status(401).send('Acess denied. No token provided.')

    try {
        const decoded = jwt.verify(token, config.get('jwt.secret'))
        req.user = decoded
        next()
    } catch (ex) {
        res.status(400).send('Invalid token.')
    }
}