const db = require("../../database")

const getAllRecipes = (done) => {
    const results = []

    db.each("SELECT * FROM feedRecipes",[],(err,row) => {
        if(err) return done(err)

        results.push({
            recipe_id: row.recipe_id,
            title: row.title,
            ingredients: row.ingredients,
            directions: row.directions,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            created_by: row.created_by
        })
    },
    (err,num_rows) => {
        return done(err,num_rows,results)
    })
}

const postNewRecipe = (recipes,id, done) => {
    let date = Date.now()
    const sql = "INSERT INTO feedRecipes (title,ingredients,directions,date_published,date_edited,created_by) VALUES (?,?,?,?,?,?)"
    let values = [recipes.title,recipes.ingredients,recipes.directions,date,date,id]
    
    db.run(sql,values,function(err){
        if(err) return done(err,null)

        return done(null,this.lastID)
    })
}
const getSingleRecipe = (id, done) => {
    const sql = 'SELECT * FROM feedRecipes WHERE recipe_id=?'
    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if (!row) return done(404)
        recipe = {
            recipe_id: row.recipe_id,
            title: row.title,
            ingredients: row.ingredients,
            directions: row.directions,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            created_by: row.created_by
        }
        return done(null, recipe)

    })
}

const updateRecipe = (recipe, done) => {
    const sql = 'UPDATE feedRecipes SET title=?,ingredients=?,directions=? WHERE recipe_id=?'
    let values = [recipe.title, recipe.ingredients, recipe.directions, recipe.recipe_id]
    db.run(
        sql,
        values,
        (err) => {
            return done(err)
        }
    )
}

const deleteRecipe = (recipe_id, done) => {
    const sql = 'DELETE FROM feedRecipes WHERE recipe_id=?';
    db.run(sql, [recipe_id], (err) => {
        return done(err)

    })
}
const getUserRecipes = (id,done) => {
    const results = []
    const sql="SELECT * FROM feedRecipes WHERE created_by=?"
    db.each(sql,[id],(err,row) => {
        if(err) return done(err)

        results.push({
            recipe_id: row.recipe_id,
            title: row.title,
            ingredients: row.ingredients,
            directions: row.directions,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            created_by: row.created_by
        })
    },
    (err,num_rows) => {
        return done(err,num_rows,results)
    })
}

module.exports = {
    getAllRecipes:getAllRecipes,
    postNewRecipe:postNewRecipe,
    getSingleRecipe:getSingleRecipe,
    deleteRecipe:deleteRecipe,
    updateRecipe:updateRecipe,
    getUserRecipes:getUserRecipes
}