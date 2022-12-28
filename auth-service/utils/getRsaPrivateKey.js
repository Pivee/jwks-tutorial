const fs = require("fs");
const { join } = require("path");

function getRsaPrivateKey(
  filePath = join(__dirname, "../certs/private.pem"),
  { returnType = undefined } = {}
) {
  const secret = fs.readFileSync(filePath);

  switch (returnType) {
    case "utf8":
      return secret.toString("utf8");
    case "base64":
      return secret.toString("base64");
  }

  return secret;
}

module.exports = {
  getRsaPrivateKey,
};
