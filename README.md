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

## 5. Create a protected route on the resource server to test

```js
> app.js

...

app.use("/protected", require("./routes/protected.route"));

...
```

```js
> protected.route.js

const router = require("express").Router();
const { getRsaPublicKey } = require("../utils/getRsaPublicKey");
const { verifyToken } = require("../utils/verifyToken");

router.get("/", async (req, res, next) => {
  const bearerToken = req?.headers?.authorization?.split(" ")[1];

  let verifiedPayload;
  try {
    verifiedPayload = verifyToken(bearerToken, getRsaPublicKey());
  } catch (error) {
    if (error.message === "invalid signature") {
      return res.status(401).send({ error: "Unauthorized" });
    }
  }
  if (!verifiedPayload) return res.status(401).send({ error: "Unauthorized" });

  return res.send({
    message: "This is a protected route. 🛡",
    token: bearerToken,
    verifiedPayload,
  });
});

module.exports = router;
```

```js
> verifyToken.js

const jwt = require("jsonwebtoken");

function verifyToken(token, secret, algorithms = ["RS256"]) {
  return jwt.verify(token, secret, {
    algorithms,
  });
}

module.exports = {
  verifyToken,
};
```

## 6. Create JWKS endpoint on the auth server

The convention is to have it as `/.well-known/jwks.json`.

```js
> app.js

...

app.use("/.well-known/jwks.json", require("./routes/jwks.json.route"));

...
```

```js
> jwks.json.route.js

const router = require("express").Router();
const { getJwks } = require("../utils/getJwks");
const { getRsaPublicKey } = require("../utils/getRsaPublicKey");

router.get("/", async (req, res, next) => {
  return res.send(getJwks(getRsaPublicKey()));
});

module.exports = router;
```

```js
> getJwks.js

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
```

## 7. Install `jwks-rsa` on the resource server

```js
> getJwksClient.js

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
```

```js
> getRsaPublicKey.js

...

async function getRsaPublicKeyFromJwks(
  jwksUri = "http://localhost:4000/.well-known/jwks.json",
  { returnType = undefined } = {}
) {
  const key = await (await getJwksClient(jwksUri)).getSigningKey();

  return key;
}

...
```

## 8. Verify token when accessing the protected route

```js
> protected.route.js

const router = require("express").Router();
const { getRsaPublicKeyFromFile } = require("../utils/getRsaPublicKey");
const { verifyToken } = require("../utils/verifyToken");

router.get("/", async (req, res, next) => {
  const bearerToken = req?.headers?.authorization?.split(" ")[1];

  let verifiedPayload;

  try {
    // // ⏺ Verify the token using locally stored RSA public key
    // verifiedPayload = verifyToken(bearerToken, getRsaPublicKeyFromFile());
    // ⏺ Verify the token using JWKS retrieved from the auth server
    verifiedPayload = verifyToken(bearerToken, getRsaPublicKeyFromFile());
  } catch (error) {
    if (error.message === "invalid signature") {
      return res
        .status(401)
        .send({ error: "Unauthorized: Invalid signature." });
    }
  }
  if (!verifiedPayload)
    return res
      .status(401)
      .send({ error: "Unauthorized: Token verification failed." });

  return res.send({
    message: "This is a protected route. 🛡",
    token: bearerToken,
    verifiedPayload,
  });
});

module.exports = router;
```
