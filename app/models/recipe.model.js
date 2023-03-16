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

module.exports = {
    getAllRecipes:getAllRecipes,
    postNewRecipe:postNewRecipe
}