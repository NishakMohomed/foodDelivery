const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true
                },
    items: { type: Object, required: true },
    title: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    orderType: { type: String, required: true },
    paymentStatus: {type: Boolean, default: false},
    address: { type: String, required: true },
    status: { type: String, default: 'order_placed'}
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);