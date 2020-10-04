const router = require("express").Router();

const userRegistrationRoute = require("./userRegistrationRoute");
const getstatusbillRoute = require("./getstatusbillRoute");

router.use("/sendmessage", userRegistrationRoute);
router.use("/getstatusbill", getstatusbillRoute);

module.exports = router;
