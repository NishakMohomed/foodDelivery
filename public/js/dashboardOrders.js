
export const initOrders = function () {
    const orderTableBody = document.querySelector('#orderTableBody');
    let orders = []

    let markup;

    axios.get('/admin/dashboard', {
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
            <td>${ order.title}.${ order.fname}<br>${ order.lname}</td>
            <td>${ order.orderType}</td>
            
            <td>
                <span class="status ${ order.status === 'delivered' ? 'completed' : 'pending'}">
                ${ order.status === 'delivered' ? 'completed' : 'pending'}
                </span>
            </td>
            <td>${ moment(order.createdAt).format('hh:mm A')}</td>
    </tr>`
        }).join('')
    }
}

