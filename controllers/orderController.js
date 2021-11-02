const Order = require('../model/order');

const moment = require('moment');

function orderController() {
    return {
        store(req, res){

            //Validate request
            const {title, fname, lname, phone, email, orderType, address} = req.body

            if(!title || !fname || !lname || !phone || !email || !orderType || !address){
                req.flash('error', 'All feilds are required');
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                title,
                fname,
                lname,
                phone,
                email,
                orderType,
                address
            });

            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully');
                    delete req.session.cart;

                    //Emit 
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', placedOrder);

                    return res.redirect('customer/viewOrders');
                })
                

            }).catch(err => {

                req.flash('error', 'Something went wrong');
                return res.redirect('/cart');
            })
        },
        async index(req, res){
            const orders = await Order.find({ customerId: req.user._id}, null, {sort: {'createdAt': -1}});
            res.header('Cahe-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
            res.render('customer/viewOrders', {orders: orders, moment: moment});
        },
        async show(req, res) {
            const order = await  Order.findById(req.params.id);
            //Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customer/orderStatus', { order });
            } 

            return res.redirect('/');
        }
    }
}

module.exports = orderController;