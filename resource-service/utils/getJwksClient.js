const jwksClient = require("jwks-rsa");

async function getJwksClient(jwksUri) {
  const client = jwksClient({
    jwksUri,
    cache: true,
    rateLimit: true,
  });

  return client;
}

module.exports = {
  getJwksClient,
};
