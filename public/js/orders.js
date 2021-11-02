
export const initOrders = function () {
    const orderTableBody = document.querySelector('#orderTableBody');
    let orders = []

    let markup;

    axios.get('/employee/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
            orders = res.data;
            markup = generateMarkup(orders);
            orderTableBody.innerHTML = markup;
        }).catch(err => {
            console.log(err);
        })

    function renderItems(items){
        let parsedItems = Object.values(items)

        return parsedItems.map((menuItem) => {
            return `
            <p>${ menuItem.item.name} - ${ menuItem.qty} pcs </p>`
        }).join('');
    }

    function generateMarkup(orders){
        return orders.map(order => {
            return `<tr>
            
            <td>
                <p class= "order_id">${ order._id}</p>
                <div>${ renderItems(order.items)}</div>
            </td>
            <td>${ order.title}.${ order.fname}<br>${ order.lname}</td>
            <td>${ order.address}</td>
            <td>${ order.phone}</td>
            <td>${ order.orderType}</td>
            <td>
                <form action="/orders/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id}">
                    <select name="status" onchange="this.form.submit()">
                        <option value="order_placed" ${ order.status === 'order_placed' ? 'selected' : ''}>Order Placed</option>
                        <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="prepared" ${ order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                        <option value="delivered" ${ order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </form>
            </td>
            <td>${ moment(order.createdAt).format('hh:mm A')}</td>
    </tr>`
        }).join('')
    }

    //Socket
    let socket = io();

    let employeeAreaPath = window.location.pathname
    
    if(employeeAreaPath.includes('employee')){
        console.log(employeeAreaPath)
        socket.emit('join', 'employeeRoom');
    }

    socket.on('orderPlaced', (order) => {

        orders.unshift(order)
        orderTableBody.innerHTML = '';
        orderTableBody.innerHTML = generateMarkup(orders);
        
    });
}

