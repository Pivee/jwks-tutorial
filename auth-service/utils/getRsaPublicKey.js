const fs = require("fs");
const { join } = require("path");

function getRsaPublicKey(
  filePath = join(__dirname, "../certs/public.pem"),
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
  getRsaPublicKey,
};
