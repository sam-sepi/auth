var RateLimit = require('express-rate-limit');
var MongoStore = require('rate-limit-mongo');

const limiter = new RateLimit({
    store: new MongoStore({
        uri: 'mongodb://127.0.0.1:27017/logger',
        //user: 'mongouser',
        //password: 'mongopassword',
        // should match windowMs
        expireTimeMs: 10 * 60 * 1000, //15 min
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
        // see Configuration section for more options and details
    }),
    max: 100,
    // should match expireTimeMs 15 min
    windowMs: 10 * 60 * 1000
})

module.exports = limiter