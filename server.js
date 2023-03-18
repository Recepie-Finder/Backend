const express = require("express")
const morgan = require('morgan')
const bodyParser = require("body-parser");
const cors = require("cors")
const db = require('./database.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const app = express()

// Server port
const HTTP_PORT = 3333

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port: " + HTTP_PORT)
});
var options = {
    explorer: true
  };
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
// Logging
app.use(morgan('tiny'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"status":"Alive"})
});

// Other API endpoints: Links go here...
require("./app/routes/users.routes")(app)
require("./app/routes/recipe.routes")(app)
require("./app/routes/ratings.routes")(app)
// Default response for any other request
app.use(function(req, res){
    res.sendStatus(404);
});
