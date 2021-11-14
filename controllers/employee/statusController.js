const Order = require('../../model/order');

function statusController(){
    return{
        update(req, res) {
            if(req.body.status === "delivered" && req.body.orderType === "cod") {
                Order.updateOne({_id: req.body.orderId}, {status: req.body.status, paymentStatus: true}, (err, data) => {
                
                    if(err){
                       return res.redirect('/employee/orders');
                    }
    
                    //Emit event
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status });
    
                    return res.redirect('/employee/orders');
                });

            } else {
                Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data) => {
                
                    if(err){
                       return res.redirect('/employee/orders');
                    }
    
                    //Emit event
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status });
    
                    return res.redirect('/employee/orders');
                });
            }
        }
    }
}

module.exports = statusController;