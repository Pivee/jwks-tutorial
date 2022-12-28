const jwt = require("jsonwebtoken");

function verifyToken(token, secret, algorithms = ["RS256"]) {
  return jwt.verify(token, secret, {
    algorithms,
  });
}

module.exports = {
  verifyToken,
};
