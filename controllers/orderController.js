const Order = require('../model/order');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
    return {
        store(req, res){

            //Validate request
            const {title, fname, lname, phone, email, orderType, address, stripeToken} = req.body

            if(!title || !fname || !lname || !phone || !email || !orderType || !address){
                return res.status(422)({message : 'All feilds are required'});
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
                price: req.session.cart.totalPrice,
                address
            });

            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    
                    // Stripe payment
                    if(orderType === 'card'){
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'usd',
                            description: `Food order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true;
                            placedOrder.save().then((ord) => {

                                //Emit 
                                const eventEmitter = req.app.get('eventEmitter');
                                eventEmitter.emit('orderPlaced', ord);
                                delete req.session.cart;
                                return res.json({success : 'Payment successfull, Order placed successfully'});

                            }).catch((err) => {
                                console.log(err);
                            });

                        }).catch((err) => {
                            delete req.session.cart;
                            return res.json({success : 'Order placed but payment failed, You can pay at delivery time'});
                        })
                    } else {

                        placedOrder.save().then((ord) => {
                            //Emit 
                            const eventEmitter = req.app.get('eventEmitter');
                            eventEmitter.emit('orderPlaced', ord);
                            delete req.session.cart;
                            return res.json({success : 'Order placed successfully'});

                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                })
                

            }).catch(err => {
                return res.status(500).json({success : 'Something went wrong'});
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