const config = require('config')

module.exports = function () {
    if (!config.get('jwt.secret')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}