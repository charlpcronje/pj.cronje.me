const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const { link } = require('fs');

globalThis.app.use(bodyParser());

const show = {
    back: true,
    mode: true,
    header: true,
    footerNav: true,
    footerScripts: true
}

router.get('/',index);
router.get('/back',back);
router.get('/login',login);
router.get('/settings',settings);
router.get('/privacy',privacy);
router.get('/terms',terms);
router.get('/fallback',fallback);
router.get('/contact',contact);
router.get('/about',about);


async function index(ctx) {
    show.back = false;
    await ctx.render('index',{
        title: 'The Precious Journey',
        show
    }); 
}

async function back(ctx) {
    ctx.redirect('back')
    if ('back' == url) url = this.ctx.get('Referrer') || alt || '/'; 
    show.header = true;
    await ctx.render('about',{
        title: 'The Precious Journey | About',
        show
    }); 
}

async function about(ctx) {
    show.header = true;
    await ctx.render('about',{
        title: 'The Precious Journey | About',
        show
    }); 
}

async function contact(ctx) {
    show.header = true;
    await ctx.render('contact',{
        title: 'The Precious Journey | Contact',
        show
    }); 
}

// List if Things
async function settings(ctx) {
    show.header = false;
    show.back = false;
    await ctx.render('settings',{
        title: 'The Precious Journey',
        show
    }); 
}

// List if Things
async function login(ctx) {
    show.header = false;
    show.back = false;
    await ctx.render('login',{
        title: 'The Precious Journey',
        show
    }); 
}

async function privacy(ctx) {
    show.header = true;
    show.back = true;
    await ctx.render('privacy',{
        title: 'The Precious Journey | Privacy',
        show
    }); 
}

async function terms(ctx) {
    show.header = true;
    show.back = true;
    await ctx.render('terms',{
        title: 'The Precious Journey | Terms',
        show
    }); 
}

async function fallback(ctx) {
    show.header = false;
    show.back = false;
    await ctx.render('fallback',{
        title: 'The Precious Journey',
        show
    }); 
}
    
router.get('/hello', async (ctx, next) => {
  ctx.body = 'Hello'
});

module.exports = router;