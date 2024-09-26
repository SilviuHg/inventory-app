const { Client } = require("pg");
require("dotenv").config();

const connectionString = process.argv[2];

if (!connectionString) {
  console.error("Error: Please provide a database connection string.");
  process.exit(1);
}

const SQL = `
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  developer VARCHAR(255),
  year_released INT
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS games_genres (
  game_id INT,
  genre_id INT,
  CONSTRAINT games_genres_pk PRIMARY KEY (game_id, genre_id),
  CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES games (id),
  CONSTRAINT fk_genre FOREIGN KEY (genre_id) REFERENCES genres (id)
);

INSERT INTO games (name, developer, year_released)  
VALUES
  ('GTA V', 'Rockstar', 2013), 
  ('The Witcher 3', 'CD Projekt Red', 2015), 
  ('Cyberpunk 2077', 'CD Projekt Red', 2020); 

INSERT INTO genres (name)
VALUES
  ('Roleplay game'),
  ('Action'),
  ('Open-world');

INSERT INTO games_genres (game_id, genre_id)
VALUES
  (1, 1), 
  (1, 2), 
  (1, 3), 
  (2, 1), 
  (2, 2), 
  (2, 3), 
  (3, 1), 
  (3, 2); 
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: connectionString,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
