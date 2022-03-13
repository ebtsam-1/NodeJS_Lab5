const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const schema  = new mongoose.Schema({
    username: 'string',
    age: 'number',
    password: 'string'


// ,{
//     toJSON: {
//         transform:(doc, ret) => ({username: ret.username, age: ret.age, id: ret.id})
//     }

})



schema.pre('save',async function(next) {
  
    const saltRounds = 10;
    
    if(this.isModified('password')){
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
    }
  
  next();
});
module.exports = schema;