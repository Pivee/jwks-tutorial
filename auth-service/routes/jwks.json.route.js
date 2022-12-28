const router = require("express").Router();
const { getJwks } = require("../utils/getJwks");
const { getRsaPrivateKey } = require("../utils/getRsaPrivateKey");

router.get("/", async (req, res, next) => {
  return res.send(getJwks(getRsaPrivateKey()));
});

module.exports = router;
