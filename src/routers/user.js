const express = require('express')
const User = require('../controllers/user')

const router = new express.Router()

router.post('/signin', User.signin)
router.post('/login', User.login)

module.exports = router