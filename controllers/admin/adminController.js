const Order = require('../../model/order');

function adminController() {
    return {
        dashboard(req, res){
            Order.find({ status: {$ne: 'completed'}}, null, {sort: {'createdAt': -1}}).
            populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr){
                    res.json(orders);
                } else{
                    res.render('admin/dashboard');
                }
                
            });
        },
        orders(req, res){
            Order.find({ status: {$ne: 'completed'}}, null, {sort: {'createdAt': -1}}).
            populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr){
                    res.json(orders);
                } else{
                    res.render('admin/orders');
                }
                
            });
        }
    }
}

module.exports = adminController;