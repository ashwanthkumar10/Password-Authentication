const express = require('express')

const router = express.Router()

const User = require('../models/Users')

const bcrypt = require('bcryptjs');
const passport = require('passport');



router.get('/login',(req,res)=>
    {
        
        res.render('login')
    })
router.get('/register',(req,res)=>
    
    {
        res.render('register')
    })

router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body
    console.log(req.body);
    
    const errors = []

    //Checks the all the required fields
    if(!name || !email||!password ||! password2)
    {
        errors.push({msg : 'Please fill all the details'})
    }
    //check password match
    if(password!==password2)
    {
        errors.push({msg : 'Passwords doesnt match'})
    }

    //Check the passwoed length

    if(password.length < 6)
    {
        errors.push({msg : 'Password should be atleast greater than 6 characters'})
    }

    
    if(errors.length > 0){
        
        console.log(errors);
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2 ,
        })
      

    }
    
    else{
        // registration passed 
        User.findOne({email : email})
        .then(user =>{
    
                if(user){
                    //User exists
                    errors.push({msg : 'Email already exists'})
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2 ,
                    })
                 }
                 else{
                    const newUser = new User({
                            name ,
                            email ,
                            password ,
                 })
                //hash Password
                bcrypt.genSalt(10,(err,salt)=>
                {
                    bcrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                        if(err) throw new Error("Error in hashing password");

                        newUser.password = hash
                        newUser.save()
                        .then(user=>
                        {
                            req.flash('success_msg','You are now registered and can log in')
                            res.redirect('/users/login')

                        })
                        .catch(err => console.log(err))
                        
                    })
                } )

                 
                 }
                
            })
    }
})

//User login handle
router.post('/login', (req,res ,next)=>
{
    passport.authenticate('login',
        {
            successRedirect : '/dashboard',
            failureRedirect : '/users/login',
            failureFlash : true
        })(req,res,next)
})


//User Logout
router.get('/logout',(req,res)=>
{
    req.logout((err) => {
        if (err) 
          return next(err); // Pass the error to the next middleware for handling
        
    req.flash('success_msg' , 'You are Logged Out')
    res.redirect('/users/login')
})
    
})

module.exports = router