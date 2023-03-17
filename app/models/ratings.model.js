
const db = require("../../database")

const addRating = (recipe_id, rating,user_id,done) => {
    let dateToday = Date.now();
    const sql='INSERT INTO ratings (rating,date_published,recipe_id, posted_by) VALUES(?,?,?,?)'
    let values = [rating, dateToday,recipe_id, user_id]
    db.run(sql, values, function(err) {
        if (err) return done(err)
        return done(null, this.lastID)
    })
    
    
}




const getRatings = (recipe_id, done) => {
  let sql = 'SELECT *, AVG(rating) AS avg_rating FROM ratings WHERE recipe_id=?';

  db.each(
      sql, [recipe_id],
      (err, row) => {
          if (err) console.log("Something went wrong: " + err);
          if (!row) return done(404)
      },
      (err, num_rows) => {
          rating.avg_rating = row.avg_rating;
          return done(err, num_rows, rating);
      }
  )
}



module.exports = {
addRating:addRating,
getRatings:getRatings
}