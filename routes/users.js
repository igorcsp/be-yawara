const auth = require('../middleware/auth')

const { User, validateUser } = require('../models/user')
const express = require('express')
const router = express.Router()

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

// router.post('/', async (req, res) => {
//     const { error } = validateUser(req.body)
//     if (error) return res.status(400).send(error.details[0].message)

//     let user = await User.findOne({ email: req.body.email })
//     if (user) return res.status(400).send('User already registered')

//     user = new User(
//         _.pick(req.body, [
//             'name',
//             'email',
//             'password',
//             'phone',
//             'address'
//         ])
//     )
//     const salt = await bcrypt.genSalt(10)
//     user.password = await bcrypt.hash(user.password, salt)

//     await user.save()

//     const token = user.generateAuthToken()
//     res.header('yawara-token', token).send(_.pick(user, ['_id', 'name', 'email', 'phone', 'address']))
// })

module.exports = router