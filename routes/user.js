const Router = require('koa-router');
const { PrismaClient } = require('@prisma/client');
const Crypt = require('../src/crypt.js');
const prisma = new PrismaClient()
const router = new Router({ 
 //   prefix: '/user' 
});
const bodyParser = require('koa-bodyparser');
globalThis.app.use(bodyParser());

const crypt = new Crypt();

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
router.get('/loginUser',loginUser);
router.post('/registerUser',registerUser);
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

async function loginUser(ctx) {

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



async function registerUser() {
const body = ctx.req.body
console.log(ctx);
  const user = await prisma.user.create({
        data : {
            role : 'BAISC',
            firstName :body.firstName,
            lastName :body.lastName,
            initials :body.initials,
            nickname :body.nickname,
            countryId :body.countryId,
            address :body.address,
            aboutMe :body.aboutMe,
            contactNumber :body.contactNumber,
            email :body.email,
            password :body.password,
            status : 'ACTIVE'
        }
    });
    console.log(user);

    ctx.redirect('/login');
}

registerUser()
        .catch(e => {
            console.error(e.message);
        })
        .finally(async() =>  {
            await prisma.$disconnect();
        })

   

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