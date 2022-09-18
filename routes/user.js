const Router = require('koa-router');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const router = new Router({ 
 //   prefix: '/user' 
});
const bodyParser = require('koa-bodyparser');
globalThis.app.use(bodyParser());

const show = {
    back: true,
    mode: true,
    header: true,
    footerNav: true,
    footerScripts: true,
    failedLogin: false
}

router.get('/forgotPassword',forgotPassword);
router.get('/forgotPassword',forgotPassword);
router.get('/changePassword',changePassword);
router.get('/forgotPasswordFailed',forgotPasswordFailed);
router.get('/profile',profile);
router.get('/register',register);
router.get('/login',login);
router.post('/login',loginCheck);
router.post('/register',registerAdd);
// List if Things
async function forgotPassword(ctx) {
    show.header = false;
    await ctx.render('forgotPassword',{
        title: 'The Precious Journey | Forgot Password',
        show
    }); 
}

async function forgotPasswordFailed(ctx) {
    show.header = false;
    await ctx.render('forgotPasswordFailed',{
        title: 'The Precious Journey | Failed',
        show
    }); 
}

async function loginCheck(ctx) {

    const body = ctx.req.body
    console.log(ctx);

    show.header = false;
    const user = await prisma.user.findFirstOrThrow({
        where: {
          email: { equals:  body.email},
          password: { equals: body.password},
          status: {equals: 'ACTIVE'}
        }
    });
    console.log(user);
    if (!user.length) {
        show.failedLogin = true;
        ctx.redirect('/login');
    } else {
        await ctx.render('welcome',{
            title: 'The Precious Journey | Welcome',
            show,
            user
        }); 
    }
}


async function login(ctx) {
    show.header = false;
    await ctx.render('login',{
        title: 'The Precious Journey | Login',
        show
    }); 
}

async function register(ctx) {
    show.header = false;
    await ctx.render('register',{
        title: 'The Precious Journey | Register',
        show
    }); 
}

async function registerAdd(ctx) {
    show.header = false;
    await ctx.render('register',{
        title: 'The Precious Journey | Register',
        show
    }); 
}

async function changePassword(ctx) {
    await ctx.render('changePassword',{
        title: 'The Precious Journey | Password',
        show
    }); 
}

async function profile(ctx) {
    await ctx.render('profile',{
        title: 'The Precious Journey | Profile',
        show
    }); 
}


module.exports = router;