var express=require('express');
var Router=express.Router();

Router.get('/',function(req,res,next)
{
     res.render('home.ejs',{message:''});
});
module.exports=Router;