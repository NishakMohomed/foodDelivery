const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: {type:String, default: null},
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    gender: {type:String, default: null},
    dob: {type:String, default: null},
    nic: {type:String, default: null},
    email: { type: String, required: true, unique: true },
    phone: {type:String, default: null},
    address: {type:String, default: null},
    password: { type: String, required: true, min: 8, max: 1024 },
    promo: {type: Boolean, default: false},
    role: { type: String, default: 'customer' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);