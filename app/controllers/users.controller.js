const users = require("../models/users.model")
const Joi = require("joi")

const getAll = (req,res) => {
    users.getAllUsers((err, num_rows, results) => {
        if(err) return res.sendStatus(500)

        return res.status(200).send(results)
    })
}

const getSingle = (req,res) => {
    let user_id = parseInt(req.params.user_id)

    users.getSingleUser(user_id, (err,results) => {
        if(err === 404) return res.sendStatus(404)
        if(err) return res.sendStatus(err)

        return res.status(200).send(results)
    })
}

const newUser = (req,res) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
    })
    const { error } = schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let user = Object.assign({},req.body)

    users.postNewUser(user,(err,id) => {
        if(err) return res.sendStatus(400)

        return res.status(201).send({user_id: id})
    })
}

const loginUser = (req,res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    users.authenticateUser(req.body.email, req.body.password, (err,id) => {
        if(err === 404) return res.status(400).send("Invalid email/password supplied")
        if(err) return res.sendStatus(500)

        users.getToken(id, (err,token) => {
            if(err) return res.sendStatus(500)

            if(token){
                return res.status(200).send({user_id: id, session_token: token})
            }else{
                users.setToken(id, (err,token) => {
                    if (err) return res.sendStatus(500)
                    return res.status(200).send({user_id: id, session_token: token})
                })
            }
        })
    })

}

const logoutUser = (req,res) => {
    let token = req.get('X-Authorization')
    users.removeToken(token,(err) => {
        if(err) return res.sendStatus(500)
        return res.sendStatus(200)
    })
}

module.exports = {
    getAll:getAll,
    getSingle:getSingle,
    newUser:newUser,
    loginUser:loginUser,
    logoutUser:logoutUser
}