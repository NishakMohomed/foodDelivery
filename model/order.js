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
    price: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'order_placed'}
}, { timestamps: true });

// Amount getter method
orderSchema.path('price').get((num) => {
  return (num / 100).toFixed(2);
});

// Amount setter method
orderSchema.path('price').set((num) => {
  return num * 100;
});


module.exports = mongoose.model('Order', orderSchema);