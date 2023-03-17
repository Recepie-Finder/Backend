const Joi = require('joi');
const recipe = require("../models/recipe.model")
const ratings = require("../models/ratings.model")
const users = require("../models/users.model")


const addRating = (req, res) => {
    const schema = Joi.object({
        "rating": Joi.number().required()
    })
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    let recipe_id = parseInt(req.params.recipe_id);
    let rating = req.body.rating;
    let token = req.get('X-Authorization')
    users.getIdFromToken(token,(err,user_id) => {
        if(err || user_id === null) {
            return res.sendStatus(401)
        }

        recipe.getSingleRecipe(recipe_id, (err, recipe) => {
            if (err === 404) return res.sendStatus(404)
            if (err) return res.sendStatus(500)
  
    ratings.addRating(recipe_id,rating,user_id, (err, id) => {
        if (err) return res.sendStatus(500);
        return res.status(201).send({rating_id: id})
    })
    })
})
}
const getRatings = (req, res) => {
    let recipe_id = parseInt(req.params.recipe_id);
    recipe.getSingleRecipe(recipe_id, (err) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)
    })
    ratings.getRatings(recipe_id, (err, num_rows, rating) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500);
        return res.status(200).send(rating);

    })
    
}


module.exports = {
    getRatings: getRatings,
    addRating: addRating
}