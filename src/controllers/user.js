const UserModel = require('../models/user.js');
const LogModel = require('../models/logger.js');

const User = {}

/**
 * 
 * @param {req.body.name, req.body.email, req.body.password, req.body.confirm} req 
 * @param {user, token} res 
 */
User.signin = async(req, res) => 
{
    if(req.body.password == req.body.confirm)
    {
        try {

            const user = new UserModel(req.body)

            await user.save()

            const log = new LogModel({ action: 'signin', author: user.id})

            await log.save()

            res.status(201).send({ user })
    
        } 
        catch(e) 
        {
            res.status(400).send({ message: e })
        }
    }
    else
    {
        res.status(400).send('Password field and confirm password not equals')
    }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
User.login = async(req, res) =>
{
    try 
    {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
            .then(user => 
            {
                if(user.error == true)
                {
                    const logger = new LoggerModel({
                        action: 'login error',
                        author: user._id
                    })
                    logger.save()

                    res.status(401).send('Login error')
                }
            })
        
        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    } 
    catch (e) 
    {
        console.log(e)
        res.status(400).send()
    }
}

module.exports = User