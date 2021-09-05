const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    action: 
    {
        type: String, 
        required: true,
        enum: 
        {
            values: ['signin', 'login', 'logout'],
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

const Log = mongoose.model('Log', LogSchema)

module.exports = Log