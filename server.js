const express = require('express')
const session = require('express-session')
const crypto = require('crypto')
const app = express()
const path = require('path')
const dbConnect =require('./config/dbConnect')
const dotenv = require('dotenv').config()
const nocache = require("nocache")


dbConnect();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//for preventing cache
app.use(nocache())

//session handling
const secretkey = crypto.randomBytes(32).toString('hex')
app.use(session({
    secret:secretkey,
    resave:false,
    saveUninitialized:true
}))




//for public
app.use(express.static(path.join(__dirname,'public')))

//ejs
app.set('view engine','ejs')


//set view
app.set('views','./views')


//user router
const userRoute = require('./Router/userRouter')
app.use('/',userRoute)

//admin Router
const adminRoute = require('./Router/adminRouter')
app.use('/admin',adminRoute)




//404
app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})


app.listen(5000,()=>console.log("server is running.."))