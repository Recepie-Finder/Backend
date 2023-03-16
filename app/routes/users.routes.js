const users = require("../controllers/users.controller")
const auth = require("../libs/middleware")

module.exports = function(app){

    app.route("/users")
        .get(auth.isAuthenticated,users.getAll)
        .post(users.newUser)
    
    app.route("/login")
        .post(users.loginUser)

    app.route("/logout")
        .post(auth.isAuthenticated,users.logoutUser)
}