var bcrypt=require('bcrypt');
var connection=require('./db_conn.js');
var express=require('express');
var Router=express.Router();
var nodemailer=require('nodemailer');
var fixed=require('./constant.js');

//creating transporter object to connect to account

var transporter=nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ks99737@gmail.com',
      pass: 'golden@050300'
    }
})

console.log(transporter);
Router.get('/',function(req,res,next)
{
     res.render('forget_pass.ejs',{message:''});
})

//setting details of the mail

var details={
    from:'ks99737@gmail.com',
    subject:'one time password to change your password',
}

Router.post('/',function(req,res,next)
{
    connection.query('select * from user where username=?',[req.body.username],function(err,rows,fields)
    {
        if(err)
         throw err;
        if(!rows.length)
          res.render('forget_pass.ejs',{message:'usernamedoes not exist'});
        else
        {
           //generating 6 digit otp
           var otp=Math.floor(Math.random()*1000000).toString();
           //setting the address of the receiver and content of the email
           details.to=rows[0]['email'];
           details.html='<p>Your one time password for password change is '+otp+'.Expires in 10 minutes</p>';
           console.log(details);
           transporter.sendMail(details,function(err,info)
           {
               console.log("mailed");
               if(err)
               {
                   console.log(err);
               }
               else
               {
                   console.log("email sent"+info.response);
               }
           })
           var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
           indiaTime = new Date(indiaTime);
           var temp=indiaTime.toLocaleString().split(',');
           temp[0]=temp[0].split('/');
           temp[0]=temp[0].reverse();
           temp[0]=temp[0].join('-');
           temp[1]=temp[1].slice(1,temp[1].length);
           temp=temp[0]+' '+temp[1];
           console.log(temp);
           var gen=saltHashPassword(otp);
           var ins={
               username:req.body.username,
               otp:gen,
               datetime:temp
           }
           connection.query('insert into otp_table set ?',[ins],function(err,rows,fields)
           {
               if(err)
                throw err;
               res.render('otp.ejs',{message:'otp is send to your registered email id',message1:req.body.username});
           })
        }
    })
})

//otp matching
Router.post('/otp_match',function(req,res,next)
{
    connection.query('select * from otp_table where username=? order by datetime desc',[req.body.username],function(err,rows,fields)
    {
         if(err) throw err;
         if(!rows.length)
          res.render('otp.ejs',{message:'otp mismatch',message1:req.body.username});
         else
         {
            var date = rows[0]['datetime'];
            date.setSeconds(date.getSeconds() - 10*60);
            date = date.toLocaleString();

            date = date.split(',');
            date[0] = date[0].split('/').reverse().join('-');

            date[1] = date[1].slice(1,date[1].length);
            date = date[0] + ' ' + date[1];
            var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
           indiaTime = new Date(indiaTime);
           var temp=indiaTime.toLocaleString().split(',');
           temp[0]=temp[0].split('/');
           temp[0]=temp[0].reverse();
           temp[0]=temp[0].join('-');
           temp[1]=temp[1].slice(1,temp[1].length);
           temp=temp[0]+' '+temp[1];
           if(temp>date||(!bcrypt.compareSync(req.body.otp,rows[0]['otp'])))
           {
               res.render("otp.ejs",{message:'otp mismatch',message1:req.body.username});
           }
           else
           {
               res.render("setpass.ejs",{message:'',message1:req.body.username});
           }
         }
    })
})
Router.post('/setpass',function(req,res,next)
{
    var newpass=saltHashPassword(req.body.password);
     connection.query('update user set password=? where username=?',[newpass,req.body.username],function(err,rows,fields)
     {
         if(err)
          throw err;
         connection.query('select * from user where username=?',[req.body.username],function(err,rows,fields)
         {
             if(err)
              throw err;
             req.session.username=req.body.username;
             req.session.userId=rows[0]['id'];
             res.redirect('/');
         })
     })
})
function saltHashPassword(password)
{
var saltRounds=10;//the cost of processing the data
var salt=bcrypt.genSaltSync(saltRounds);//generate  a dynamic salt
var hash=bcrypt.hashSync(password,salt);//generate hash of the plain text password and append it with the dynamic salt
return hash;
}
module.exports=Router;