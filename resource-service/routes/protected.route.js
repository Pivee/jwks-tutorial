const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { getRsaPublicKey } = require("../utils/getRsaPublicKey");
const { verifyToken } = require("../utils/verifyToken");

router.get("/", async (req, res, next) => {
  const bearerToken = req?.headers?.authorization?.split(" ")[1];

  let verifiedPayload;
  try {
    verifiedPayload = verifyToken(bearerToken, getRsaPublicKey());
  } catch (error) {
    if (error.message === "invalid signature") {
      return res.status(401).send({ error: "Unauthorized" });
    }
  }
  if (!verifiedPayload) return res.status(401).send({ error: "Unauthorized" });

  return res.send({
    message: "This is a protected route. 🛡",
    token: bearerToken,
    verifiedPayload,
  });
});

module.exports = router;
