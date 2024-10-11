const db = require("../db/queries");

exports.homepageGet = (req, res) => {
  res.render("index");
};

exports.allItemsGet = async (req, res) => {
  // render all items
  const items = await db.getItems();
  res.render("./itemViews/itemsList", { items: items });
};

exports.createItemGet = (req, res) => {
  // render item form
  res.render("./itemViews/createItem");
};

exports.createItemPost = (req, res) => {
  // submit item form
};

exports.itemGet = (req, res) => {
  // render item individually
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
