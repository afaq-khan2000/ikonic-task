var express = require("express");
const { problem_one, problem_two, problem_three } = require("../controllers/problems");

const router = express.Router();

router.get("/problem-one", problem_one);
router.get("/problem-two", problem_two);
router.get("/problem-three", problem_three);

module.exports = router;
