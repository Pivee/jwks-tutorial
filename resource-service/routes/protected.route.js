const router = require("express").Router();
const { getRsaPublicKeyFromFile } = require("../utils/getRsaPublicKey");
const { verifyToken } = require("../utils/verifyToken");

router.get("/", async (req, res, next) => {
  const bearerToken = req?.headers?.authorization?.split(" ")[1];

  let verifiedPayload;

  try {
    // // ⏺ Verify the token using locally stored RSA public key
    // verifiedPayload = verifyToken(bearerToken, getRsaPublicKeyFromFile());
    // ⏺ Verify the token using JWKS retrieved from the auth server
    verifiedPayload = verifyToken(bearerToken, getRsaPublicKeyFromFile());
  } catch (error) {
    if (error.message === "invalid signature") {
      return res
        .status(401)
        .send({ error: "Unauthorized: Invalid signature." });
    }
  }
  if (!verifiedPayload)
    return res
      .status(401)
      .send({ error: "Unauthorized: Token verification failed." });

  return res.send({
    message: "This is a protected route. 🛡",
    token: bearerToken,
    verifiedPayload,
  });
});

module.exports = router;
