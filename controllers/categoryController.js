const db = require("../db/queries");
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

exports.createCategoryPost = (req, res) => {
  // submit category form
  //redirect
};

exports.categoryGet = (req, res) => {
  // render categories individually
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
