const mongoose = require('mongoose'); //mongoose
const validator = require('validator'); //validator
const bcrypt = require('bcryptjs') //bcrypt
const jwt = require('jsonwebtoken') //jsonwebtoken
const LoggerModel = require('./logger')

//https://mongoosejs.com/docs/guide.html#definition
const userSchema = new mongoose.Schema(
    {
        name: 
        {
            type: String,
            required: true,
            trim: true,

            validate(value) 
            {
                if(!validator.isAlphanumeric(value))
                {
                    throw new Error('Username alphanumeric required')
                }
            }
        },
        email: 
        {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,

            validate(value) 
            {
                if(!validator.isEmail(value)) 
                {
                    throw new Error('Email is invalid')
                }
            }

        },
        password: 
        {
            type: String,
            required: true,
            minlength: 7,
            trim: true 
        },
        date: 
        {
            type: Date, 
            default: Date.now 
        },
        tokens: 
        [{
            token: 
            {
                type: String,
                required: true
            }
        }]
    }
)

//Adds an instance method to documents constructed from Models compiled from this schema.
userSchema.methods.generateAuthToken = async function () 
{
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'mysecretokenbl@')

    if(!token) 
    {
        throw new Error('Error token')
    }

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Adds static "class" methods to Models compiled from this schema.
userSchema.statics.findByCredentials = async(email, password) => 
{
    const user = await User.findOne({ email })

    if(!user) 
    {
        throw new Error('Unable to login')
    }

    const isAuth = await bcrypt.compare(password, user.password)

    if(!isAuth) 
    {
        user.error = true;
    }

    return user
}

//Defines a pre hook for the model.
userSchema.pre('save', async function (next) 
{
    const user = this

    if (user.isModified('password')) 
    {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

/**
When you call mongoose.model() on a schema, Mongoose compiles a model for you.

const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, 
lowercased version of your model name. 
Thus, for the example above, the model Tank is for the tanks collection in the database.
 */
const User = mongoose.model('User', userSchema)

module.exports = User