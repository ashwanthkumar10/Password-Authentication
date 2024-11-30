const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const app = express()

//Passport config
require('./configs/passport')(passport)
const mongoose = require('mongoose')
const indexRouter = require('./routes/index') 
const userRouter = require('./routes/users') 
const bodyParser = require('body-parser')


mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//body- Parser
// app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: false })); // For form submissions
app.use(express.json());

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }))
  //Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


  //Flash
app.use(flash())  


//Global varaibles

app.use((req,res,next)=>
{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})



//static file 

// app.use(static('public'))
//Routes or middlewares

app.use(indexRouter)
app.use('/users',userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server is running on ${PORT}`))