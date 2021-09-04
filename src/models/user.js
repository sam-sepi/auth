//Mongoose https://mongoosejs.com/
const mongoose = require('mongoose'); //mongoose
//input validator https://www.npmjs.com/package/validator
const validator = require('validator'); //validator
//bcrypt for pss https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs') //bcrypt
//token for auth https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken') //jsonwebtoken
//unique val https://www.npmjs.com/package/mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

//https://mongoosejs.com/docs/guide.html#definition
const userSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: [true, 'required'],
        trim: true,
        unique: true,
        validate(value)
        {
            if(!validator.isAlphanumeric(value))
            {
                throw new Error('Username alphanumeric required')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'required'],
        trim: true,
        lowercase: true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email invalid')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'required'],
        trim: true,
        match: [/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/, '7 to 15 characters which contain at least one numeric digit and a special character']
    },
    date: {
        type: Date, 
        default: Date.now 
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    role: {
        type: String
    }
})

//unique handle error
userSchema.plugin(uniqueValidator, { message: 'Username or email taken'});

//Adds an instance method to documents constructed from Models compiled from this schema.
userSchema.methods.generateAuthToken = async function () {
    
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
userSchema.statics.findByCredentials = async(email, password) => {
    
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isAuth = await bcrypt.compare(password, user.password)

    if(!isAuth) {
        throw new Error('Unable to login')
    }

    return user
}

//Defines a pre hook for the model.
userSchema.pre('save', async function (next) 
{
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

/**
 * Mongoose also supports populating virtuals. A populated virtual contains documents from another collection. To define a populated virtual, you need to specify:
 * 1) The ref option, which tells Mongoose which model to populate documents from.
 * 2) The localField and foreignField options. Mongoose will populate documents from the model in ref whose foreignField matches this document's localField.
 */
userSchema.virtual('logs', {
    ref: 'Logger',
    localField: '_id',
    foreignField: 'author'
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