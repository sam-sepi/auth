const User = require('../models/user');
const Log = require('../models/log');

/**
 * 
 * @param {name, email, password, confirm} req 
 * @param {user, token} res 
 */
exports.signin = async(req, res) => {
    
    if(req.body.password == req.body.confirm) {
        
        if(req.body.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)) {

            try {

                const user = new User(req.body)
    
                await user.save()
    
                const log = new Log({action: 'signin', author: user.id})
    
                await log.save()
    
                res.status(201).send({ user })
            } 
            catch(e) {
                res.status(400).send({ message: e.message })
            }
        } else {
            res.status(400).send('Password (7-15 chars) must contain upper, lower, digit and special character')
        }
    }else {
        res.status(400).send('Password field and confirm password not equals')
    }
}

/**
 * LOGIN 
 * 
 * @param {email, password} req 
 * @param {user, token} res 
 */
exports.login = async(req, res) =>
{
    try 
    {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        
        const log = new Log({action: 'login', author: user.id})
        
        await log.save()

        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    } 
    catch(e) 
    {
        console.log(e)
        res.status(400).send()
    }
}