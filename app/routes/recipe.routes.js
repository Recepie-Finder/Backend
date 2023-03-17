const recipe = require("../controllers/recipe.controller")
const auth = require("../libs/middleware")

module.exports = function(app){

    app.route("/recipes")
        .get(auth.isAuthenticated,recipe.getAll)
        .post(auth.isAuthenticated,recipe.postRecipe)

    app.route("/recipes/:recipe_id")
        .get(auth.isAuthenticated,recipe.getOne)
        .patch(auth.isAuthenticated, recipe.updateRecipe)
        .delete(auth.isAuthenticated, recipe.deleteRecipe);
        
    app.route("/recipesByUser")
        .get(auth.isAuthenticated, recipe.getUserRecipes)
}