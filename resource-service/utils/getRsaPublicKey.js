const fs = require("fs");
const { join } = require("path");
const { getJwksClient } = require("./getJwksClient");

function getRsaPublicKeyFromFile(
  filePath = join(__dirname, "../certs/public.pem"),
  { returnType = undefined } = {}
) {
  const key = fs.readFileSync(filePath);

  switch (returnType) {
    case "utf8":
      return key.toString("utf8");
    case "base64":
      return key.toString("base64");
  }

  return key;
}

async function getRsaPublicKeyFromJwks(
  jwksUri = "http://localhost:4000/.well-known/jwks.json",
  { returnType = undefined } = {}
) {
  const key = await (await getJwksClient(jwksUri)).getSigningKey();

  return key;
}

module.exports = {
  getRsaPublicKeyFromFile,
  getRsaPublicKeyFromJwks,
};
