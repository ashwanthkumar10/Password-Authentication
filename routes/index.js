const express = require('express')

const router = express.Router()

const {ensureAuthenticated} = require('../configs/Auth')

//Welcome
router.get('/',(req,res)=>
{
    res.render('welcome');
    
})


//dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>
{
    res.render('dashboard',
        {
            name : req.user.name
        });
    
})

module.exports = router