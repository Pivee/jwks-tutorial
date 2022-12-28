const jwt = require("jsonwebtoken");

function createToken(payload, secret, expiresIn = "15min") {
  const token = jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "RS256",
  });

  return token;
}

module.exports = { createToken };
