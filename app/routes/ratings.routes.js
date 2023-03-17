const ratings = require("../controllers/ratings.controller");
const auth = require("../libs/middleware");

module.exports = function(app) {
  app.route("/recipes/:recipe_id/ratings")
    .post(auth.isAuthenticated,ratings.addRating) 
    .get(ratings.getRatings); 

};