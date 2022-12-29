const router = require("express").Router();
const { createToken } = require("../utils/createToken");
const { getRsaPrivateKey } = require("../utils/getRsaPrivateKey");

router.get("/", async (req, res, next) => {
  const payload = { kid: "AUTH_KID" };

  res.send({
    tokenResponse: {
      access_token: createToken(payload, getRsaPrivateKey()),
    },
  });
});

module.exports = router;
