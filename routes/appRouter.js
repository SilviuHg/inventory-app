const { Router } = require("express");
const itemsController = require("../controllers/itemsController");
const categoryController = require("../controllers/categoryController");
const router = Router();

router.get("/", itemsController.homepageGet); // render homepage

router.get("/create-item", itemsController.createItemGet); // render item form
router.post("/create-item", itemsController.createItemPost);

router.get("/create-category", categoryController.createCategoryGet); // render category form
router.post("/create-category", categoryController.createCategoryPost);

router.get("/categories", categoryController.allCategoriesGet); // render all categories
router.get("/items", itemsController.allItemsGet); // render all items

router.get("/item/:id/", itemsController.itemGet); // render each item individually
router.post("/item/:id/", itemsController.itemDeletePost); // delete item
router.get("/item/:id/update", itemsController.itemUpdateGet); // update each item individually
router.post("/item/:id/update", itemsController.itemUpdatePost);

router.get("/category/:id", categoryController.categoryGet); // render each category individually
router.post("/category/:id", categoryController.categoryDeletePost); // delete category
router.get("/category/:id/update", categoryController.categoryUpdateGet); // update each category individually
router.post("/category/:id/update", categoryController.categoryUpdatePost);

module.exports = router;
