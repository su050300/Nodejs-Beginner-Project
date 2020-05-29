var express=require('express');
var Router=express.Router();

Router.get('/',function(req,res,next)
{
    if(!req.session.username)
    {
        res.render("home.ejs",{message:''});
    }
    else
    {
        res.render("home.ejs",{message:req.session.username});
    }
})
module.exports=Router;