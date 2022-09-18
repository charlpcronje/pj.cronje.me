const Router = require('koa-router');
const Crypt = require('./crypt.js');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const crypt = new Crypt();

async function main() {
  const user = await prisma.user.create({
        data : {
            role : "ADMIN",
            firstName : "Charl",
            lastName : "Cronje",
            initials : "CP",
            nickname : "Charl",
            countryId : "741fc252-3655-11ed-a261-0242ac120002",
            address : "4 Burger Ave,\n Centurion\n Pretoria",
            aboutMe : "Senior Full Stack Web / Software Engineer",
            contactNumber : "082123123",
            email : "charl@cronje.me",
            password : crypt.encrypt("4334"),
            status : "PENDING"
        }
    });
    console.log(user);
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async() =>  {
        await prisma.$disconnect();
    })