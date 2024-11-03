const db = require("../db/queries");
// manage delete/edit category/items
exports.createCategoryGet = (req, res) => {
  // render category form
  res.render("./categoryViews/createCategory");
};

exports.allCategoriesGet = async (req, res) => {
  // render all categories
  const categories = await db.getCategories();
  res.render("./categoryViews/categories", {
    categories: categories,
  });
};

exports.createCategoryPost = async (req, res) => {
  // submit category form
  await db.insertCategory(req.body.category);
  res.redirect("/");
};

exports.categoryGet = async (req, res) => {
  // render categories individually
  const category = await db.getCategory(req.params.id);
  res.render("./categoryViews/filteredCategory", {
    genre_name: category[0].genre_name,
    games: category.filter((item) => item.game_id), // only include games if a category has any, if not, include just genre_name
  });
};

exports.categoryDeletePost = (req, res) => {
  // Delete category
};

exports.categoryUpdateGet = (req, res) => {
  // render category update form
};

exports.categoryUpdatePost = (req, res) => {
  // submit updated category
};
