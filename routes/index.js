const combineRouters = require('koa-combine-routers');
const rootRouter = require('./root');
const userRouter = require('./user');

const router = combineRouters(
    rootRouter,
    userRouter
);
module.exports = router;