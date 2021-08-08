const UserModel = require('../models/user.js');

const User = {}

User.signin = async(req, res) => 
{
    const user = new UserModel(req.body)

    if(req.body.password == req.body.confirm)
    {
        try {

            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
    
        } 
        catch(e) 
        {
            res.status(400).send(e)
        }
    }
    else
    {
        res.status(400).send('Password field and confirm password not equals')
    }

}

User.login = async(req, res) =>
{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
}

module.exports = User