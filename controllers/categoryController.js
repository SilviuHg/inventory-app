const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const lengthErr = "must be between 1 and 25 characters.";

const validateCategory = [
  body("category")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage(`Category name ${lengthErr}`),
];

// manage edit category/items
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
    genre: category[0],
    games: category.filter((item) => item.game_id), // only include games if a category has any, if not, include just genre_name
  });
};

exports.categoryDeletePost = async (req, res) => {
  // Delete category

  const categoryRows = await db.getCategory(req.params.id);

  // check if a category has games (a non null game_id)
  const hasGames = categoryRows.some((row) => row.game_id !== null);

  if (hasGames) {
    return res.status(400).render("./categoryViews/filteredCategory", {
      genre: categoryRows[0],
      games: categoryRows.filter((item) => item.game_id),
      errors: [{ msg: "You can't delete a category with games in it!" }],
    });
  }

  await db.deleteCategory(req.params.id);
  res.redirect("/");
};

exports.categoryUpdateGet = (req, res) => {
  // render category update form
};

exports.categoryUpdatePost = (req, res) => {
  // submit updated category
};
