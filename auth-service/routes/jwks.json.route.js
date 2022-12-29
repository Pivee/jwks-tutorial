const router = require("express").Router();
const { getJwks } = require("../utils/getJwks");
const { getRsaPublicKey } = require("../utils/getRsaPublicKey");

router.get("/", async (req, res, next) => {
  return res.send(getJwks(getRsaPublicKey()));
});

module.exports = router;
