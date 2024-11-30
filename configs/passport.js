const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

//Load the user model
const User = require('../models/Users');
const passport = require('passport');

module.exports = function(passport) {
    passport.use('login',
        new LocalStrategy({usernameField : 'email'},(email,password,done)=>{
            //Match the User

            User.findOne({email : email})
            .then(user => {
                if(!user)
                {
                return done(null , false , {message:'That email is not registered'})
                }

            //Match Password
            bcrypt.compare(password,user.password,(err, isMatch)=>
            {
                if(err) throw err
                if(isMatch){
                    return done(null , user)
                }
                else
                {
                    return done(null , false , {message : 'Password is incorrect'})
                }
            })    
            })
            .catch(err => console.log(err))
        })
    )

// const passport = require('passport');
 // Replace with your User model

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by ID
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Use async/await
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


}


