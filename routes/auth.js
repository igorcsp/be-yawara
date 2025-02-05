const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User, validateUser } = require('../models/user')
const express = require('express')
const router = express.Router()
const _ = require('lodash')

router.post('/login', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken()
    res.send(token)
})

router.post('/register', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered')

    user = new User(
        _.pick(req.body, [
            'name',
            'email',
            'password',
            'phone',
            'address'
        ])
    )
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const token = user.generateAuthToken()
    res.header('yawara-token', token).send(_.pick(user, ['_id', 'name', 'email', 'phone', 'address']))
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    })
    return schema.validate(req)
}

module.exports = router