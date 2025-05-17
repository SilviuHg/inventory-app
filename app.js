const express = require("express");
const path = require("node:path");

const router = require("./routes/appRouter");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// ROUTES
app.use("/", router);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .send(err.message || "Oops! Something went wrong.");
});

// SERVER LISTENER
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Inventory app - listening on port ${port}!`)
);

// git test
