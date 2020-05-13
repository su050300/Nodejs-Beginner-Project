//setting connection to mysql using nodejs mysql module
var mysql=require('mysql');

var conn=mysql.createConnection({
          host:'localhost',
          user:'root',
          password:'Su@050300',
          database:'nodep',
          timezone:'Z'
});

conn.connect(function(err)
{
    if(err)
     throw err;
    console.log('hey you are connected....');
});
module.exports=conn;