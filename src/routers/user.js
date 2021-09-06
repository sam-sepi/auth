const express = require('express')
const User = require('../controllers/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/signin', User.signin)
router.post('/login', User.login)
router.post('/logout', auth, User.logout)

module.exports = router