var bcrypt=require('bcrypt');
var connection=require('./db_conn.js');
var express=require('express');
var Router=express.Router();

Router.get('/',function(req,res,next)
{
   res.render('login.ejs',{message:''});
});


Router.post('/',function(req,res,next)
{
   connection.query('select * from user where username=?', [req.body.username], function (err, rows,fields) {
           if(err)
            throw error;
           if(!rows.length)
           {
              res.render('login.ejs',{message:'username does not exist'});
           }
           else if(!bcrypt.compareSync(req.body.password,rows[0]['password'])) 
           {
               res.render('login.ejs',{message:'username and password does not match'});
           }
           else
           {
              connection.query('select * from user where username=?',[req.body.username],function(err,rows,fields)
              {
                  if(err)
                   throw err;
                  req.session.username=req.body.username;
                  req.session.userId= rows[0]['id'];
                  res.redirect('/');
              })
           }
   });
});
module.exports=Router;