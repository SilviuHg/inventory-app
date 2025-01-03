const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const lengthErr = "must be between 1 and 25 characters.";
const rangeErr = `Year released must be a valid year (range between 1900-${new Date().getFullYear()})`;
const numErr = "must only contain numbers";

const validateGame = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Game name ${lengthErr}`),
  body("developer")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Developer name ${lengthErr}`),
  body("year_released")
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(rangeErr)
    .isNumeric()
    .withMessage(`Year released ${numErr}`),
  body("genres").custom((value) => {
    // check if there is any value selected from the list
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error("At least one genre must be selected.");
    }
    return true;
  }),
];

exports.homepageGet = (req, res) => {
  res.render("index");
};

exports.allItemsGet = async (req, res) => {
  // render all items
  const items = await db.getItems();
  res.render("./itemViews/itemsList", { items: items });
};

exports.createItemGet = async (req, res) => {
  // render item form
  const categories = await db.getCategories(); // get the list of categories for each item
  res.render("./itemViews/createItem", { categories: categories });
};

// submit item form
exports.createItemPost = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("./itemViews/createItem", {
        categories: await db.getCategories(),
        errors: errors.array(),
      });
    }

    const { name, developer, year_released, genres } = req.body;

    // Normalize genres to always be an array - this is done to ensure that even if a single value is sent, it will be parsed as an array
    const normalizedGenres = Array.isArray(genres) ? genres : [genres];

    const gameId = await db.insertGame(name, developer, year_released);
    await db.insertGameGenres(gameId, normalizedGenres);
    res.redirect("/");
  },
];

exports.itemGet = async (req, res) => {
  // render item individually
  const item = await db.getItem(req.params.id);
  res.render("./itemViews/item", { item: item });
};

exports.itemDeletePost = async (req, res) => {
  // Delete item
  await db.deleteItem(req.params.id);
  res.redirect("/");
};

exports.itemUpdateGet = async (req, res) => {
  // render item update form
  const categories = await db.getCategories();
  const item = await db.getItem(req.params.id); // the item returns a row for each category

  const game = {
    id: item[0].id,
    name: item[0].name,
    developer: item[0].developer,
    year_released: item[0].year_released,
    genres: item.map((row) => row.genre_id), // extract the categories into a single array
  };

  res.render("./itemViews/updateItem", { categories: categories, game: game });
};

// submit updated item
exports.itemUpdatePost = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    const categories = await db.getCategories();

    if (!errors.isEmpty()) {
      const item = await db.getItem(req.params.id);

      const game = {
        id: item[0].id,
        name: item[0].name,
        developer: item[0].developer,
        year_released: item[0].year_released,
        genres: item.map((row) => row.genre_id),
      };

      // render form with errors
      return res.status(400).render("./itemViews/updateItem", {
        categories: categories,
        game: game,
        errors: errors.array(),
      });
    }

    const { name, developer, year_released, genres } = req.body;
    const { id } = req.params;

    const normalizedGenres = Array.isArray(genres) ? genres : [genres];

    await db.updateGame(id, name, developer, year_released);
    await db.updateGameGenres(id, normalizedGenres);

    res.redirect("/items");
  },
];
