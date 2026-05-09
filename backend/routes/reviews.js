const express = require("express");
const router = express.Router();
const { requireUser } = require("../auth/requireUser");
const { createReview } = require("../services/reviews");

router.post("/", requireUser, createReview);

module.exports = router;
