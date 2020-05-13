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
   var pass=saltHashPassword(req.body.password);
   connection.query('SELECT password from user WHERE username=?', [req.body.username], function (err, rows,fields) {
           if(err)
            throw error;
           if(!rows.length)
           {
              res.render('login.ejs',{message:'username does not exist'});
           }
           else if(!bcrypt.compareSync(req.body.password,pass)) 
           {
               res.render('login.ejs',{message:'username and password does not match'});
           }
           else
           {
              connection.query('SELECT * FROM user WHERE username=?',[req.body.username],function(err,rows,fields)
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
function saltHashPassword(password)
{
var saltRounds=10;//the cost of processing the data
var salt=bcrypt.genSaltSync(saltRounds);//generate  a dynamic salt
var hash=bcrypt.hashSync(password,salt);//generate hash of the plain text password and append it with the dynamic salt
return hash;
}
module.exports=Router;