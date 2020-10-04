const router = require("express").Router();
const {
  getstatusbillController,
} = require("../../controllers/getstatusbillController");

router.post("/", getstatusbillController);

module.exports = router;
