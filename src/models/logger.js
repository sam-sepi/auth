const mongoose = require('mongoose');

const LoggerSchema = new mongoose.Schema(
    {
        action: 
        {
            type: String, 
            required: true,
            enum: 
            {
                values: ['signin', 'login', 'signin error', 'login error', 'record jwt', 'jwt error', 'logout'],
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
    }
)

const Logger = mongoose.model('Log', LoggerSchema)

module.exports = Logger