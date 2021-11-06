export function placeOrder(formObject) {
    axios.post('/orders', formObject).then((res) => {
        setTimeout(() => {
            window.location.href = 'customer/viewOrders'
        }, 1000);
        
    }).catch((err) => {
        console.log(err);
    });
}