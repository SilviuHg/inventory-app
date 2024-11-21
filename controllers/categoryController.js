const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const lengthErr = "must be between 1 and 25 characters.";

const validateCategory = [
  body("category")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Category name ${lengthErr}`),
];

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

// submit category form
exports.createCategoryPost = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("./categoryViews/createCategory", {
        errors: errors.array(),
      });
    }

    await db.insertCategory(req.body.category);
    res.redirect("/");
  },
];

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
