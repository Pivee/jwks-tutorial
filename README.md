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

