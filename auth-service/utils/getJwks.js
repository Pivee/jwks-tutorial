const pem2jwk = require("pem-jwk").pem2jwk;

function getJwks(publicKey) {
  return {
    keys: [
      pem2jwk(
        publicKey,
        { alg: "RS256", use: "sig", kid: "AUTH_KID" },
        "public"
      ),
    ],
  };
}

module.exports = {
  getJwks,
};
