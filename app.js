// Core Node Modules
require('dotenv').config();
// console.log(process.env.APP_KEY)
const path = require('path');
const static = require('koa-static');
const Koa = require('koa');
const override = require('koa-methodoverride')
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const auth = require('koa-basic-auth');


globalThis.app = new Koa();

// Koa Modules
globalThis.app.use(static('.'));

// sessions
globalThis.app.keys = [process.env.APP_KEY];
globalThis.app.use(session(app));

// body parser and Method Override
globalThis.app.use(override());
globalThis.app.use(bodyParser());

// authentication
//require('./src/auth');
globalThis.app.use(passport.initialize());
globalThis.app.use(passport.session());

const routers = require('./routes')
const favicon = require('koa-favicon');
const json = require('koa-json');
const render = require('koa-ejs');

// Some Middleware
app.use(json());
app.use(favicon(__dirname + '/assets/img/favicon.webp'));

// Router Middleware
app.use(routers());

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


render(app, {
    root: path.join(__dirname,'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});
   

// Simple Middleware Example
// app.use(async ctx => (ctx.body = { msg: 'Hello World'}));
app.listen(process.env.APP_PORT,() => console.log('Server Started...'));