var bcrypt=require('bcrypt');
var saltRounds=10;//the cost of processing the data
var password="golend@050300";//users password
var salt=bcrypt.genSaltSync(saltRounds);//generate  a dynamic salt
console.log(salt);
var hash=bcrypt.hashSync(password,salt);//generate hash of the plain text password and append it with the dynamic salt
console.log(hash.length);
