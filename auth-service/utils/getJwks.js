const pem2jwk = require("pem-jwk").pem2jwk;

function getJwks(privateKey) {
  return { keys: [pem2jwk(privateKey, { use: "sig" }, "public")] };
}

module.exports = {
  getJwks,
};
