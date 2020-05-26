var bcrypt=require('bcrypt');
var connection=require('./db_conn.js');
var express=require('express');
var Router=express.Router();

Router.get('/',function(req,res,next)
{
   res.render('register.ejs',{message:''});
});
Router.post('/',function(req,res,next)
{
   /*step 1:--need to check whether the username already exists or not*/
   connection.query('select * from user where username=?',[req.body.username],function(err,rows,fields)
   {
        if(err)
         throw err;
        if(rows.length)
        {
           res.render('register.ejs',{message:'username already exists'});
        }
        else
        {
           /*step2:--need to check whether the email already exists or not*/
           connection.query('select * from user where email=?',[req.body.email],function(err,rows,fields)
           {
                 if(err)
                  throw err;
                 if(rows.length)
                  res.render('register.ejs',{message:'email already exists'});
                 else
                 {
                    /*step 3:--we need to hash the password */
                    var pass=saltHashPassword(req.body.password);
                    const user={
                       name:req.body.name,
                       username:req.body.username,
                       email:req.body.email,
                       password:pass,
                       gender:req.body.gender
                    };
                    /*step4:-- inserting user data into user table*/
                    connection.query('insert into user set ?',[user],function(err,rows,fields)
                    {
                        if(err)
                         throw err;
                        /*step5:-- set the session variable*/
                        connection.query('select * from user where username=?',[user.username],function(err,rows,fields){
                        if(err)
                          throw err;
                        req.session.username=user.username;
                        req.session.userId=rows[0]['id'];
                        res.redirect('/');
                        });
                    });
                 }
           });
        }
   }) ;
});
function saltHashPassword(password)
{
var saltRounds=10;//the cost of processing the data
var salt=bcrypt.genSaltSync(saltRounds);//generate  a dynamic salt
var hash=bcrypt.hashSync(password,salt);//generate hash of the plain text password and append it with the dynamic salt
return hash;
}
module.exports=Router;