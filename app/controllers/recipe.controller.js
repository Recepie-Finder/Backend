const recipe = require("../models/recipe.model")
const users = require("../models/users.model")
const Joi = require("joi")

const getAll = (req,res) => {
    recipe.getAllRecipes((err, num_rows, results) => {
        if(err) return res.sendStatus(500)

        return res.status(200).send(results)
    })
}

const postRecipe = (req,res) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        ingredients: Joi.string().required(),
        directions: Joi.string().required(),
    })
    const { error } = schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let recipes = Object.assign({},req.body)
    let token = req.get('X-Authorization')

    users.getIdFromToken(token,(err,user_id) => {
        if(err || user_id === null) {
            return res.sendStatus(401)
        }

        recipe.postNewRecipe(recipes,user_id,(err,id) => {
            if(err) return res.sendStatus(400)
    
            return res.status(201).send({recipe_id: id})
        })
    })
}

module.exports = {
    getAll: getAll,
    postRecipe:postRecipe
}