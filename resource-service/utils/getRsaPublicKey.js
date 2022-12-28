const fs = require("fs");
const { join } = require("path");

function getRsaPublicKey(
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

module.exports = {
  getRsaPublicKey,
};
