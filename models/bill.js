const mongoose = require('mongoose');

// Schema
const billSchema = mongoose.Schema({
   
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    payFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    payTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    },
})
// For used id instead of _id
billSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

billSchema.set('toJSON', {
    virtuals:true,
})

// Model
exports.Bill = mongoose.model('Bill', billSchema);
