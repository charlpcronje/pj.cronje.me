# Koa Framework
#### Parts

1.  [Building a RESTful API with Koa and Postgres](http://mherman.org/blog/2017/08/23/building-a-restful-api-with-koa-and-postgres)
2.  [Stubbing HTTP Requests with Sinon](http://mherman.org/blog/2017/11/06/stubbing-http-requests-with-sinon)
3.  [User Authentication with Passport and Koa](http://mherman.org/blog/2018/01/02/user-authentication-with-passport-and-koa) (this article)
4.  [Stubbing Node Authentication Middleware with Sinon](http://mherman.org/blog/2018/01/22/stubbing-node-authentication-middleware-with-sinon)

#### Main NPM Dependencies

1.  Koa v[2.3.0](https://github.com/koajs/koa/releases/tag/2.3.0)
2.  Mocha v[3.5.0](https://github.com/mochajs/mocha/releases/tag/v3.5.0)
3.  Chai v[4.1.1](https://github.com/chaijs/chai/releases/tag/4.1.1)
4.  Chai HTTP v[3.0.0](https://github.com/chaijs/chai-http/releases/tag/3.0.0)
5.  Knex v[0.13.0](https://github.com/tgriesser/knex/releases/tag/0.13.0)
6.  pg v[7.1.2](https://github.com/brianc/node-postgres/releases/tag/v7.1.2)
7.  koa-router v[7.2.1](https://github.com/alexmingoia/koa-router/releases/tag/v7.2.1)
8.  koa-bodyparser v[4.2.0](https://github.com/koajs/bodyparser/releases/tag/4.2.0)
9.  koa-passport v[4.0.1](https://github.com/rkusa/koa-passport/releases/tag/4.0.1)
10.  koa-session v[5.5.1](https://github.com/koajs/session/releases/tag/5.5.1)
11.  passport-local v[1.0.0](https://github.com/jaredhanson/passport-local/releases/tag/v1.0.0)
12.  bcrypt.js v[2.4.3](https://github.com/dcodeIO/bcrypt.js/releases/tag/2.4.3)
13.  koa-redis v[3.1.1](https://github.com/koajs/koa-redis/releases/tag/v3.1.1)

## Contents

-   [Objectives](https://mherman.org/blog/user-authentication-with-passport-and-koa//#objectives)
-   [Project Setup](https://mherman.org/blog/user-authentication-with-passport-and-koa//#project-setup)
-   [User Model](https://mherman.org/blog/user-authentication-with-passport-and-koa//#user-model)
-   [Passport Setup](https://mherman.org/blog/user-authentication-with-passport-and-koa//#passport-setup)
-   [Passport Local Strategy](https://mherman.org/blog/user-authentication-with-passport-and-koa//#passport-local-strategy)
-   [Routes and Tests](https://mherman.org/blog/user-authentication-with-passport-and-koa//#routes-and-tests)
-   [Password Hashing](https://mherman.org/blog/user-authentication-with-passport-and-koa//#password-hashing)
-   [Redis Session Store](https://mherman.org/blog/user-authentication-with-passport-and-koa//#redis-session-store)
-   [Conclusion](https://mherman.org/blog/user-authentication-with-passport-and-koa//#conclusion)

## Objectives

By the end of this tutorial, you will be able to???

1.  Discuss the overall client/server authentication workflow
2.  Add Passport and passport-local to a Koa app
3.  Configure bcrypt.js for salting and hashing passwords
4.  Practice test driven development
5.  Register and authenticate a user
6.  Utilize sessions to store user information via koa-session
7.  Explain why you may want to use an external session store to store session data
8.  Set up an external session store with Redis
9.  Render HTML pages via server-side templating

## Project Setup

Start by cloning down the base Koa project:

```
$ git clone https://github.com/mjhea0/node-koa-api \
  --branch v2 --single-branch
$ cd node-koa-api
```

Then, check out the [v2](https://github.com/mjhea0/node-koa-api/releases/tag/v2) tag to the master branch and install the dependencies:

```
$ git checkout tags/v2 -b master
$ npm install
```

Take a quick look at the code along with the project structure:

```s
????????? knexfile.js
????????? package.json
????????? src
??????? ????????? server
???????     ????????? db
???????     ??????? ????????? connection.js
???????     ??????? ????????? migrations
???????     ??????? ??????? ????????? 20170817152841_movies.js
???????     ??????? ????????? queries
???????     ??????? ??????? ????????? movies.js
???????     ??????? ????????? seeds
???????     ???????     ????????? movies_seed.js
???????     ????????? index.js
???????     ????????? routes
???????         ????????? index.js
???????         ????????? movies.js
????????? test
    ????????? routes.index.test.js
    ????????? routes.movies.test.js
    ????????? sample.test.js
```

This is just a basic RESTful API, with the following routes:

| URL | HTTP Verb | Action |
| --- | --- | --- |
| /api/v1/movies | GET | Return ALL movies |
| /api/v1/movies/:id | GET | Return a SINGLE movie |
| /api/v1/movies | POST | Add a movie |
| /api/v1/movies/:id | PUT | Update a movie |
| /api/v1/movies/:id | DELETE | Delete a movie |

> Want to learn how to build this project? Review the [Building a RESTful API With Koa and Postgres](http://mherman.org/blog/2017/08/23/building-a-restful-api-with-koa-and-postgres) blog post.

[Download](https://www.postgresql.org/download/) and install Postgres (if necessary), and then fire up the server on port 5432. Open psql, in the terminal, and create two new databases, one for development and the other for testing:

```sql
$ psql

# CREATE DATABASE koa_api;
CREATE DATABASE
# CREATE DATABASE koa_api_test;
CREATE DATABASE
# \q
```

Ensure the tests pass:

```sh
$ npm test

Server listening on port: 1337
  routes : index
    GET /
      ??? should return json

  routes : movies
    GET /api/v1/movies
      ??? should return all movies
    GET /api/v1/movies/:id
      ??? should respond with a single movie
      ??? should throw an error if the movie does not exist
    POST /api/v1/movies
      ??? should return the movie that was added
      ??? should throw an error if the payload is malformed
    PUT /api/v1/movies
      ??? should return the movie that was updated
      ??? should throw an error if the movie does not exist
    DELETE /api/v1/movies/:id
      ??? should return the movie that was deleted
      ??? should throw an error if the movie does not exist

  Sample Test
    ??? should pass


  11 passing (624ms)
```

Apply the migrations, and seed the database:

```sh
$ knex migrate:latest --env development
$ knex seed:run --env development
```

Run the Koa server, via `npm start`, and navigate to [http://localhost:1337/api/v1/movies](http://localhost:1337/api/v1/movies). You should see something similar to:

```
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "The Land Before Time",
      "genre": "Fantasy",
      "rating": 7,
      "explicit": false
    },
    {
      "id": 2,
      "name": "Jurassic Park",
      "genre": "Science Fiction",
      "rating": 9,
      "explicit": true
    },
    {
      "id": 3,
      "name": "Ice Age: Dawn of the Dinosaurs",
      "genre": "Action/Romance",
      "rating": 5,
      "explicit": false
    }
  ]
}
```

## User Model

Generate a new migration template for the user model:

```
$ knex migrate:make users
```

Then update the newly created file:

```
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
```

Apply the migration against the development database:

```
$ knex migrate:latest --env development
```

## Passport Setup

Install the [koa-passport](https://github.com/jaredhanson/passport) wrapper module:

```sh
$ npm install koa-passport@4.0.1 --save
```

Then, update _src/server/index.js_ to add Passport to the app middleware along with [koa-session](https://github.com/koajs/session), which is used for managing sessions:

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');

const app = new Koa();
const PORT = process.env.PORT || 1337;

// sessions
app.keys = ['super-secret-key'];
app.use(session(app));

// body parser
app.use(bodyParser());

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(indexRoutes.routes());
app.use(movieRoutes.routes());

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
```

> In production, make sure to update the secret key, `app.keys`. For example, you can use Python to generate a secure key:
> 
> ```
> $ python3
> >> import os
> >> os.urandom(24)
> b'3\xa5\xfa\xc6\xfb\x0e\x1dA\x19-U\x15Y\x9e2]\x92/\x97\x8d\xecsJ\xb7'
> ```

Install koa-session:

```
$ npm install koa-session@5.5.1 --save
```

Sessions are stored in a cookie by default on the client-side, unencrypted. We???ll stick with this for now, just to get things up and running, but we???ll refactor and add Redis before all is said and done.

Before moving on, let???s handle [serializing and de-serializing the user information to the session](https://github.com/jaredhanson/passport#sessions). Create a new file called _auth.js_ in ???src/server???:

```
const passport = require('koa-passport');
const knex = require('./db/connection');

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser((id, done) => {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});
```

## Passport Local Strategy

Next, install the [passport-local](https://github.com/jaredhanson/passport-local) strategy, which is used for authenticating with a username and password:

```
$ npm install passport-local@1.0.0 --save
```

Update _auth.js_ like so:

```
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

const knex = require('./db/connection');

const options = {};

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser((id, done) => {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, (username, password, done) => {
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (password === user.password) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
  .catch((err) => { return done(err); });
}));
```

Here, we check if the user exists and the password matches what???s in the database and then pass the results back to Passport via the callback:

-   _Does the username exist?_
    -   No? then `false` is returned
    -   Yes? _Does the password match?_
        -   No? `false` is returned
        -   Yes? The user object is returned and then the `id` is serialized to the session

> You probably noticed that we are checking that the provided password is literally the same as the password pulled from the database, so we are storing the password in plain text. We???ll update this after we add the main routes.

## Routes and Tests

Like the majority of my tutorials, we???ll write tests first. That said, we will _only_ be testing the happy paths. It???s up to you to add tests for handling errors.

Routes:

| URL | HTTP Verb | Authenticated? | Result |
| --- | --- | --- | --- |
| /auth/register | GET | No | Render the register view |
| /auth/register | POST | No | Register a new user |
| /auth/login | GET | No | Render the login view |
| /auth/login | POST | No | Log a user in |
| /auth/status | GET | Yes | Render the status page |
| /auth/logout | GET | Yes | Log a user out |

Full Authentication flow:

1.  The end user provides a username and a password and the credentials are sent to the server-side
2.  The server-side Koa app then checks the credentials against the database
    -   If they are correct, the end user is redirected to `/auth/status`
    -   If they are incorrect, the end user is redirected to `/auth/login`

Create a new file called _routes.auth.test.js_ in ???test???:

```
process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : auth', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

});
```

This is just a boilerplate for the tests.

### Register - GET

This route serves up a view with an HTML form for users to register with.

#### Test

Start with a test:

```
describe('GET /auth/register', () => {
  it('should render the register view', (done) => {
    chai.request(server)
    .get('/auth/register')
    .end((err, res) => {
      should.not.exist(err);
      res.redirects.length.should.eql(0);
      res.status.should.eql(200);
      res.type.should.eql('text/html');
      res.text.should.contain('<h1>Register</h1>');
      res.text.should.contain(
        '<p><button type="submit">Register</button></p>');
      done();
    });
  });
});
```

Run the tests. You should see the following error:

```
Uncaught AssertionError: expected [Error: Not Found] to not exist
```

Now let???s write the code to get it to pass???

#### Code

First, add a new file to the ???src/server/routes??? folder called _auth.js_:

```
const Router = require('koa-router');
const passport = require('koa-passport');
const fs = require('fs');
const queries = require('../db/queries/users');

const router = new Router();

router.get('/auth/register', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./src/server/views/register.html');
});

module.exports = router;
```

Add another new file called _users.js_ to ???src/server/db/queries???. Leave the file empty for now. Create the ???views??? folder, and then add the _register.html_ template:

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Register</title>
</head>
<body>
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p><label>Username: <input type="text" name="username"/></label></p>
    <p><label>Password: <input type="password" name="password"/></label></p>
    <p><button type="submit">Register</button></p>
  </form>
</body>
</html>
```

Register the auth routes in _src/server/index.js_:

```
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const app = new Koa();
const PORT = process.env.PORT || 1337;

// sessions
app.keys = ['super-secret-key'];
app.use(session(app));

// body parser
app.use(bodyParser());

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(indexRoutes.routes());
app.use(movieRoutes.routes());
app.use(authRoutes.routes());

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
```

Ensure the tests now pass:

```
$ npm test

Server listening on port: 1337
  routes : auth
    GET /auth/register
      ??? should render the register view

  routes : index
    GET /
      ??? should return json

  routes : movies
    GET /api/v1/movies
      ??? should return all movies
    GET /api/v1/movies/:id
      ??? should respond with a single movie
      ??? should throw an error if the movie does not exist
    POST /api/v1/movies
      ??? should return the movie that was added
      ??? should throw an error if the payload is malformed
    PUT /api/v1/movies
      ??? should return the movie that was updated
      ??? should throw an error if the movie does not exist
    DELETE /api/v1/movies/:id
      ??? should return the movie that was deleted
      ??? should throw an error if the movie does not exist

  Sample Test
    ??? should pass


  12 passing (868ms)
```

### Register - POST

#### Test

Again, start with a test:

```
describe('POST /auth/register', () => {
  it('should register a new user', (done) => {
    chai.request(server)
    .post('/auth/register')
    .send({
      username: 'michael',
      password: 'herman'
    })
    .end((err, res) => {
      should.not.exist(err);
      res.redirects[0].should.contain('/auth/status');
      done();
    });
  });
});
```

The test should fail with the following error, since the route does not exist:

```
Uncaught AssertionError: expected [Error: Not Found] to not exist
```

#### Code

Add the route handler:

```
router.post('/auth/register', async (ctx) => {
  const user = await queries.addUser(ctx.request.body);
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.redirect('/auth/status');
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});
```

Here, if the user is successfully added to the database, we call the `login` method, [from koa-passport](https://github.com/rkusa/koa-passport/blob/master/lib/framework/koa.js#L44), to trigger the creation of the session and then redirect the user to `/auth/status`

For the `addUser()` helper, add the following code to _src/server/db/queries/users.js_:

```
const knex = require('../connection');

function addUser(user) {
  return knex('users')
  .insert({
    username: user.username,
    password: user.password
  })
  .returning('*');
}

module.exports = {
  addUser,
};
```

Ensure the tests pass.

### Status

Add the route handler:

```
router.get('/auth/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/status.html');
  } else {
    ctx.redirect('/auth/login');
  }
});
```

For this route, we???ll skip the tests since we???ll have to stub the `isAuthenticated()` method and manually set a cookie.

Add the template:

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Status</title>
</head>
<body>
  <p>You are authenticated.</p>
  <p><a href="/auth/logout">Logout</a>?</p>
</body>
</html>
```

To test, fire up the server via `npm start` and navigate to [http://localhost:1337/auth/status](http://localhost:1337/auth/register). Register a new user. You should be redirected to `auth/status` and a cookie should be set:

![koa passport status](https://mherman.org/assets/img/blog/koa/koa-passport-status.png)

### Login - GET

For this route, we???ll serve up a view with an HTML form for users to log in with.

#### Test

```
describe('GET /auth/login', () => {
  it('should render the login view', (done) => {
    chai.request(server)
    .get('/auth/login')
    .end((err, res) => {
      should.not.exist(err);
      res.redirects.length.should.eql(0);
      res.status.should.eql(200);
      res.type.should.eql('text/html');
      res.text.should.contain('<h1>Login</h1>');
      res.text.should.contain(
        '<p><button type="submit">Log In</button></p>');
      done();
    });
  });
});
```

#### Code

Add the route handler:

```
router.get('/auth/login', async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/login.html');
  } else {
    ctx.redirect('/auth/status');
  }
});
```

Then, add the _login.html_ template:

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Login</title>
</head>
<body>
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p><label>Username: <input type="text" name="username"/></label></p>
    <p><label>Password: <input type="password" name="password"/></label></p>
    <p><button type="submit">Log In</button></p>
  </form>
</body>
</html>
```

The tests should now pass.

### Login - POST

#### Test

```
describe('POST /auth/login', () => {
  it('should login a user', (done) => {
    chai.request(server)
    .post('/auth/login')
    .send({
      username: 'jeremy',
      password: 'johnson'
    })
    .end((err, res) => {
      res.redirects[0].should.contain('/auth/status');
      done();
    });
  });
});
```

#### Code

```
router.post('/auth/login', async (ctx) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.redirect('/auth/status');
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});
```

Let???s also create a new Knex seed file to add a test user to the database:

```
$ knex seed:make users
```

Add the following code to the newly created seed in ???src/server/db/seeds???:

```
exports.seed = (knex, Promise) => {
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'jeremy',
        password: 'johnson'
      })
    );
  });
};
```

The tests should now pass. Before moving on, try adding a few more tests to handle errors as well.

### Logout

We won???t be writing any tests for this route either since we???ll have to stub portions of the auth workflow. So, just add the route handler:

```
router.get('/auth/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/auth/login');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});
```

Manually test by registering a new user. If all is well, you should be redirected to `auth/status` and a cookie should be set. Then ensure that the cookie is removed after you log out.

Make sure all tests pass before moving on.

## Password Hashing

Install [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) to handle the salting and hashing of passwords:

```
$ npm install bcryptjs@2.4.3 --save
```

Start by adding a helper method called `comparePassword` to _src/server/auth.js_:

```
function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
```

Add the import as well:

```
const bcrypt = require('bcryptjs');
```

This helper can now be used when we pull a user from the database and check that the passwords are equal:

```
passport.use(new LocalStrategy(options, (username, password, done) => {
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));
```

Next, update the `addUser` function in _src/server/db/queries/users.js_:

```
const bcrypt = require('bcryptjs');
const knex = require('../connection');

function addUser(user) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  return knex('users')
  .insert({
    username: user.username,
    password: hash,
  })
  .returning('*');
}

module.exports = {
  addUser,
};
```

Do the same for the user seed in _src/server/db/seeds/users.js_:

```
const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('johnson', salt);
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'jeremy',
        password: hash,
      })
    );
  });
};
```

Now, instead of adding a plain text password to the database, we salt and hash it first.

Drop and recreate the `koa_api` database, apply the migrations, and then run the server and manually test everything out.

Finally, make sure the tests still pass:

```
$ npm test

Server listening on port: 1337
  routes : auth
    GET /auth/register
      ??? should render the register view
    POST /auth/register
      ??? should register a new user (211ms)
    GET /auth/login
      ??? should render the login view
    POST /auth/login
      ??? should login a user (99ms)

  routes : index
    GET /
      ??? should return json

  routes : movies
    GET /api/v1/movies
      ??? should return all movies
    GET /api/v1/movies/:id
      ??? should respond with a single movie
      ??? should throw an error if the movie does not exist
    POST /api/v1/movies
      ??? should return the movie that was added
      ??? should throw an error if the payload is malformed
    PUT /api/v1/movies
      ??? should return the movie that was updated
      ??? should throw an error if the movie does not exist
    DELETE /api/v1/movies/:id
      ??? should return the movie that was deleted
      ??? should throw an error if the movie does not exist

  Sample Test
    ??? should pass


  15 passing (3s)
```

## Redis Session Store

It???s a good idea to move session data out of memory and into an external session store as you begin scaling your application.

For example, if you scale horizontally and start spinning up new instances of the same Node application to share the load, then users would need to log in to each instance separately if sessions are stored in memory. On the other hand, if sessions are stored in an external session store (like Redis), session data can be shared across all instances of the app. In the latter case, users would need to log in just once.

To utilize Redis as the session store, first install [koa-redis](https://github.com/koajs/koa-redis):

```
$ npm install koa-redis@3.1.1 --save
```

Then, update the `koa-session` middleware config in _src/server/index.js_:

```
app.use(session({
  store: new RedisStore()
}, app));
```

Add the dependency:

```
const RedisStore = require('koa-redis');
```

Take note of the [default options](https://github.com/koajs/koa-redis#options) for koa-redis, making any necessary changes. Then, [download and install Redis](https://redis.io/download) (if necessary) and spin up the server in a new terminal tab:

```
$ redis-server
```

Fire up the app and register a new user, taking note of the cookie:
