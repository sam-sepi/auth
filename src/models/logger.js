const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    action: 
    {
        type: String, 
        required: true,
        enum: 
        {
            values: ['signin', 'login', 'login error', 'record jwt', 'jwt error', 'logout'],
            message: '{VALUE} is not supported'
        }
    },
    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: 
    {
        type: Date, 
        default: Date.now 
    }
})

const Log = mongoose.model('Log', LogsSchema)

module.exports = Log