require("../bot/index");
const express = require("express");

const path = require("path");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/apiroutes/apiRoutes");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../build")));
app.use("/", apiRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { app };
