const recipe = require("../models/recipe.model")
const users = require("../models/users.model")
const Joi = require("joi")

const getAll = (req,res) => {
    recipe.getAllRecipes((err, num_rows, results) => {
        if(err) return res.sendStatus(500)

        return res.status(200).send(results)
    })
}

const getSaved = (req,res) => {
    let token = req.get('X-Authorization')
    users.getIdFromToken(token,(err,user_id) => {
        if(err || user_id === null) {
            return res.sendStatus(400)
        }
        recipe.getSavedRecipes(user_id,(err,num_rows,results) => {
            if(err) return res.sendStatus(500)

            return res.status(200).send(results)
        })
    })
}

const postRecipe = (req,res) => {
    const schema = Joi.object({
        image: Joi.string().required(),
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

const saveRecipe = (req,res) => {
    const schema = Joi.object({
        recipe_id: Joi.number().allow(null),
        image: Joi.string().required(),
        title: Joi.string().required(),
        ingredients: Joi.string().allow(null),
        directions: Joi.string().allow(null),
        date_published: Joi.string().allow(null),
        created_by: Joi.number(),
      });
    const { error } = schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let recipes = Object.assign({}, req.body)
    let token = req.get('X-Authorization')

    users.getIdFromToken(token,(err,user_id) => {
        if(err || user_id === null) {
            return res.sendStatus(400)
        }
        recipe.saveNewRecipe(recipes,user_id,(err,id) => {
            if(err) return res.sendStatus(400)

            return res.status(201).send({recipe_id: id})
        })
    })
}
const updateRecipe = (req, res) => {
    let recipe_id = parseInt(req.params.recipe_id);
    recipe.getSingleRecipe(recipe_id, (err, recipeData) => { // changed parameter name to recipeData
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)

        const schema = Joi.object({
            "title": Joi.string(),
            "ingredients": Joi.string(),
            "directions": Joi.string()
        })
        const {
            error
        } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        if (req.body.hasOwnProperty("title")) {
            recipeData.title = req.body.title // changed variable name to recipeData
        }
        if (req.body.hasOwnProperty("ingredients")) {
            recipeData.ingredients = req.body.ingredients // changed variable name to recipeData
        }
        if (req.body.hasOwnProperty("directions")) {
            recipeData.directions = req.body.directions // changed variable name to recipeData
        }
        recipe.updateRecipe(recipeData, (err) => { // changed variable name to recipeData
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            }
            return res.sendStatus(200)

        })
    })
}

const deleteRecipe = (req, res) => {
    let recipe_id = parseInt(req.params.recipe_id);
    recipe.getSingleRecipe(recipe_id, (err, recipeData) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)
        recipe.deleteRecipe(recipe_id, (err) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(200);
        })
    })
}

const deleteSavedRecipe = (req,res) => {
    let saved_id = parseInt(req.params.saved_id)
    recipe.deleteSaved(saved_id,(err) => {
        if (err) return res.sendStatus(500)
        return res.sendStatus(200)
    })
}

const getOne = (req, res) => {
    let recipe_id = parseInt(req.params.recipe_id);
    recipe.getSingleRecipe(recipe_id, (err, recipe) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)
        return res.status(200).send(recipe)
    })
}

const getUserRecipes =(req,res) => {
    let token = req.get('X-Authorization')
    users.getIdFromToken(token,(err,user_id) => {
        if(err || user_id === null) {
            return res.sendStatus(401)
        }
    recipe.getUserRecipes(user_id,(err, num_rows, results) => {
        if(err) return res.sendStatus(500)

        return res.status(200).send(results)
    })
    })
}
module.exports = {
    getAll: getAll,
    getOne:getOne,
    postRecipe:postRecipe,
    updateRecipe:updateRecipe,
    deleteRecipe:deleteRecipe,
    getUserRecipes:getUserRecipes,
    saveRecipe:saveRecipe,
    getSaved:getSaved,
    deleteSavedRecipe:deleteSavedRecipe
}