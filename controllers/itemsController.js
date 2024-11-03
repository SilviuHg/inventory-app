const db = require("../db/queries");

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

exports.createItemPost = async (req, res) => {
  // submit item form
  const { name, developer, year_released, genres } = req.body;
  const gameId = await db.insertGame(name, developer, year_released);
  await db.insertGameGenres(gameId, genres);
  res.redirect("/");
};

exports.itemGet = async (req, res) => {
  // render item individually
  const item = await db.getItem(req.params.id);
  res.render("./itemViews/item", { item: item });
};

exports.itemDeletePost = (req, res) => {
  // Delete item
};

exports.itemUpdateGet = (req, res) => {
  // render item update form
};

exports.itemUpdatePost = (req, res) => {
  // submit updated item
};
