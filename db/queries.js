const pool = require("./pool");

async function getCategories() {
  try {
    const { rows } = await pool.query("SELECT * FROM genres");
    return rows;
  } catch (err) {
    console.error("Error retrieving categories", err);
    throw err;
  }
}

async function getItems() {
  try {
    const { rows } = await pool.query("SELECT * FROM games");
    return rows;
  } catch (err) {
    console.error("Error retrieving games", err);
    throw err;
  }
}

async function getItem(id) {
  try {
    const { rows } = await pool.query(
      `SELECT games.*, genres.genre_name , genres.id as genre_id
      FROM games 
      INNER JOIN games_genres
      ON games.id = games_genres.game_id
      INNER JOIN genres
      ON games_genres.genre_id = genres.id
      WHERE games.id = $1`,
      [id]
    );
    return rows;
  } catch (err) {
    console.error("Error retrieving game information", err);
    throw err;
  }
}

async function getCategory(id) {
  try {
    const { rows } = await pool.query(
      `SELECT genres.genre_name, genres.id as genre_id, games.id as game_id, games.name
      FROM genres 
      LEFT JOIN games_genres
      ON genres.id = games_genres.genre_id
      LEFT JOIN games
      ON games_genres.game_id = games.id
      WHERE genres.id = $1`,
      [id]
    );
    return rows;
  } catch (err) {
    console.error("Error retrieving category information", err);
    throw err;
  }
}

async function insertCategory(category) {
  try {
    await pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [category]);
  } catch (err) {
    console.error("Error adding category", err);
    throw err;
  }
}

async function insertGame(name, developer, year_released) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO games (name, developer, year_released) VALUES ($1, $2, $3) RETURNING id",
      [name, developer, year_released]
    );
    return rows[0].id; // return the game's id
  } catch (err) {
    console.error("Error adding game", err);
    throw err;
  }
}

async function insertGameGenres(gameId, genres) {
  try {
    const insertPromises = genres.map(async (genreId) => {
      return pool.query(
        "INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)",
        [gameId, genreId]
      );
    });
    await Promise.all(insertPromises);
  } catch (err) {
    console.error("Error adding game genre", err);
    throw err;
  }
}

async function deleteItem(id) {
  try {
    await pool.query(`DELETE FROM games_genres WHERE game_id = $1`, [id]);
    await pool.query(`DELETE FROM games WHERE id = $1`, [id]);
  } catch (err) {
    console.error("Error while trying to delete", err);
    throw err;
  }
}

async function deleteCategory(id) {
  try {
    await pool.query(`DELETE FROM genres WHERE id = $1`, [id]);
  } catch (err) {
    console.error("Error while trying to delete", err);
    throw err;
  }
}

async function updateGame(id, name, developer, year) {
  try {
    await pool.query(
      `UPDATE games SET name = $1, developer = $2, year_released = $3 WHERE id = $4`,
      [name, developer, year, id]
    );
  } catch (err) {
    console.error("Error updating game details", err);
    throw err;
  }
}

async function updateGameGenres(gameId, genres) {
  try {
    await pool.query(`DELETE FROM games_genres WHERE game_id = $1`, [gameId]); // first delete the old categories from the game

    const insertPromises = genres.map((genreId) =>
      pool.query(
        `INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)`,
        [gameId, genreId]
      )
    );

    await Promise.all(insertPromises);
  } catch (err) {
    console.error("Error updating game genres", err);
    throw err;
  }
}

async function updateCategory(id, genreName) {
  try {
    await pool.query(`UPDATE genres SET genre_name = $1 WHERE id = $2`, [
      genreName,
      id,
    ]);
  } catch (err) {
    console.error("Error updating category", err);
    throw err;
  }
}

module.exports = {
  getCategories,
  getItems,
  getItem,
  getCategory,
  insertCategory,
  insertGame,
  insertGameGenres,
  deleteItem,
  deleteCategory,
  updateGame,
  updateGameGenres,
  updateCategory,
};
