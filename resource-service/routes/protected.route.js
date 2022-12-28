const router = require("express").Router();

router.get("/", async (req, res, next) => {
  res.send({ message: "This is a protected route. 🛡" });
});

module.exports = router;
