const mongoose = require('mongoose');

// Schema
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
   
})

// For used id instead of _id
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals:true,
})

// Model
exports.User = mongoose.model('User', userSchema);
