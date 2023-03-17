const ratings = require("../controllers/ratings.controllers");
const auth = require("../lib/authentication");

module.exports = function(app) {
  app.route("/recipes/:recipe_id/ratings")
    .post(auth.isAuthenticated,ratings.addRating) 
    .get(ratings.getRatings); 

};