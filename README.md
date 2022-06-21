# oa-nodejs-internship-lesson3-express-pt1

Simple Express.js REST API with faux (fake) DB.

## Basic Usage

Start server

```bash
npm install
node index.js
```

Test any of the `/v1/user` REST endpoints:

```bash
# get all users
curl -X GET 'localhost:3000/v1/user'

# get user by ID
curl -X GET 'localhost:3000/v1/user/1'

# create user
curl -X POST 'localhost:3000/v1/user' -H 'Content-Type: application/json' -d '{"name": "test user", "email": "test@email.com"}'

# put user by ID
curl -X PUT 'localhost:3000/v1/user/1' -H 'Content-Type: application/json' -d '{"name": "put user", "email": "put@email.com"}'

# patch user by ID
curl -X PATCH 'localhost:3000/v1/user/1' -H 'Content-Type: application/json' -d '{"name": "patch user"}'

# delete user by ID
curl -X DELETE 'localhost:3000/v1/user/1'
```

## Additional tests (optional)

Check request body validation (Joi is used):

```bash
# cause validation error (see src/components/user/schemas@userCreateSchema)
curl -X POST 'localhost:3000/v1/user' -H 'Content-Type: application/json' -d '{"email": "not@valid"}'
```

Check DB "email" unique index:

```bash
# cause DB error (see src/db/model@checkIndexes)
# replace "email" in the body with any value you already have in the faux DB users list
curl -X POST 'localhost:3000/v1/user' -H 'Content-Type: application/json' -d '{"name": "test", "email": "stepan@test.com"}'
```

Check 404 Resource Not Found:

```bash
# works for every ID-based request
# replace `999` with any ID that you don't have
curl -X GET 'localhost:3000/v1/user/999'
```

Check 404 Route Not Found:

```bash
curl -X GET 'localhost:3000/v1/user/first'
```
