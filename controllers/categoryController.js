const db = require("../db/queries");
// manage add items (queries + controllers)
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

exports.createCategoryPost = (req, res) => {
  // submit category form
  //redirect
};

exports.categoryGet = async (req, res) => {
  // render categories individually
  const category = await db.getCategory(req.params.id);
  res.render("./categoryViews/filteredCategory", { category: category });
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
