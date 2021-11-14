
export const initOrders = function () {
    const orderTableBody = document.querySelector('#orderTableBody');
    let orders = []

    let markup;

    axios.get('/admin/orders', {
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
                <div>
                    <p class= "order_id">${ order._id}</p><br>
                    <div>${ renderItems(order.items)}</div>
                </div>
            </td>
            <td>${ order.title}.${ order.fname}<br>${ order.lname}</td>
            <td>${ order.address}</td>
            <td>${ order.phone}</td>
            <td>${ order.orderType}</td>
            <td>LKR ${ (order.price / 100).toFixed(2) }</td>
            <td>
                <span class="status ${ order.status === 'delivered' ? 'completed' : 'pending'}">
                    ${ order.status === 'delivered' ? 'completed' : 'pending'}
                </span>
            </td>
            <td>${ moment(order.createdAt).format('hh:mm A')}</td>
    </tr>`
        }).join('')
    }

    //Socket
    let socket = io();

    let adminAreaPath = window.location.pathname
    
    if(adminAreaPath.includes('admin')){
        console.log(adminAreaPath)
        socket.emit('join', 'adminRoom');
    }

    socket.on('orderPlaced', (order) => {

        orders.unshift(order)
        orderTableBody.innerHTML = '';
        orderTableBody.innerHTML = generateMarkup(orders);
        
    });
}

