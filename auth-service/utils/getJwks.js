const pem2jwk = require("pem-jwk").pem2jwk;

function getJwks(privateKey) {
  return pem2jwk(privateKey, { use: "sig" }, "public");
}

module.exports = {
  getJwks,
};
