const router = require("express").Router();
const multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const { userRegistrationControllerPost } = require("../../controllers/");

router.post("/", upload.single("file"), userRegistrationControllerPost);

module.exports = router;
