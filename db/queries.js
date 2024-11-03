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
      `SELECT genres.genre_name , genres.id as genre_id, games.id as game_id, games.name
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
    console.error("Error retrieving game information", err);
    throw err;
  }
}

async function insertCategory(category) {
  await pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [category]);
}

async function insertGame(name, developer, year_released) {
  const { rows } = await pool.query(
    "INSERT INTO games (name, developer, year_released) VALUES ($1, $2, $3) RETURNING id",
    [name, developer, year_released]
  );
  return rows[0].id; // return the game's id
}

async function insertGameGenres(gameId, genres) {
  const insertPromises = genres.map(async (genreId) => {
    return pool.query(
      "INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)",
      [gameId, genreId]
    );
  });
  await Promise.all(insertPromises);
}

module.exports = {
  getCategories,
  getItems,
  getItem,
  getCategory,
  insertCategory,
  insertGame,
  insertGameGenres,
};
