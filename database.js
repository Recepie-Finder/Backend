const sqlite3 = require('sqlite3').verbose()
const crypto = require("crypto")


const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.') 

        db.run(`CREATE TABLE users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name text,
                    last_name text,
                    email text UNIQUE,
                    password text,
                    salt text,
                    session_token text,
                    CONSTRAINT email_unique UNIQUE (email)
                )`,
            (err) => {

                if(err){
                    console.log("Users table already created")
                }else{
                    console.log("Users table created")
                }


                const ADMIN_PASSWORD = "Admin123!"

                const getHash = function(password, salt){
                    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
                };

                const INSERT = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)'
                const salt = crypto.randomBytes(64);
                const hash = getHash(ADMIN_PASSWORD, salt);

                db.run(INSERT, ["admin", "admin", "admin@admin.com", hash, salt.toString('hex')], (err) => {
                    if(err){
                        console.log("Admin account already exists")
                    } 
                })
            }
        )

        db.run(`CREATE TABLE feedRecipes (
                    recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    image text,
                    title text,
                    ingredients text,
                    directions text,
                    date_published DATE,
                    date_edited DATE,
                    created_by INTEGER,
                    FOREIGN KEY(created_by) REFERENCES users(user_id)
                )`,
            (err) => {
                if(err){
                    console.log("Feed Recipes table already created")
                }else{
                    console.log("Feed Recipes table created")
                }

                const INSERT_RECIPE = 'INSERT INTO feedRecipes (image,title,ingredients,directions,date_published,date_edited,created_by) VALUES (?,?,?,?,?,?,?)'
                db.run(INSERT_RECIPE, ["https://www.kitchensanctuary.com/wp-content/uploads/2020/04/Vegetable-Pasta-Bake-Square-FS-19.jpg","Pasta Bake","pasta,cheese,tomato sauce,salt","Boil pasta,add tomato sauce,let it sit for 10minutes at 150,add cheese, stir,serve",Date.now(),Date.now(),1], (err) => {
                    if(err){
                        console.log("Recipe one already exists")
                    }
                })
            }
        )
        db.run(`CREATE TABLE ratings (
            rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
            rating INTEGER,
            date_published INTEGER,
            recipe_id INTEGER,
            posted_by INTEGER,
            FOREIGN KEY(recipe_id) REFERENCES feedRecipes(recipe_id),
            FOREIGN KEY(posted_by) REFERENCES users(user_id)
        )`,
    (err) => {
        if(err){
            console.log("Ratings table already created")
        }else{
            console.log("Ratings table created")
        }
    }
)
        db.run(`CREATE TABLE savedRecipes (
            recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            ingredients text,
            date_published INTEGER,
            saved_by INTEGER,
            FOREIGN KEY(saved_by) REFERENCES users(user_id)
        )`,
    (err) => {
        if(err){
            console.log("Saved Recipes table already created")
        }else{
            console.log("Saved Recipes table created")
        }
    }
)

  

    }
});


module.exports = db
