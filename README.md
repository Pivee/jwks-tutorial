# JWKS Tutorial

## 1. Create the two repositories

It's simpler to use `express-draft` and then use `exp .` to generate a simple express application inside each of the repos.

### Install `express-draft` globally

```sh
npm i -g express-draft
```

## 2. Update one of the servers to use a different port

| Service          | Port |
| ---------------- | ---- |
| auth-service     | 4000 |
| resource-service | 3000 |

## 3. Generate RSA keys using OpenSSL

### Generate private key

```sh
openssl genrsa -out ./certs/private.pem
```

### Generate public key

```sh
openssl rsa -in ./certs/private.pem -pubout -out ./certs/public.pem
```

## 4. Add /token endpoint to Auth Server

```js
> token.route.js

const router = require("express").Router();
const { createToken } = require("../utils/createToken");
const { getRsaPrivateKey } = require("../utils/getRsaPrivateKey");

router.get("/", async (req, res, next) => {
  const payload = {};

  res.send({
    tokenResponse: {
      access_token: createToken(payload, getRsaPrivateKey()),
    },
  });
});

module.exports = router;
```

```js
> app.js
...

app.use("/token", require("./routes/token.route"));

...
```

```js
> createToken.js

const jwt = require("jsonwebtoken");

function createToken(payload, secret, expiresIn = "15min") {
  const token = jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "RS256",
  });

  return token;
}

module.exports = { createToken };
```

```js
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
```
