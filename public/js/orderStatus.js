
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })
    let stepCompleted = true;

    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            } 
        }
    });
}


updateStatus(order);


//Socket.io client side
let socket = io();


//join
if(order){
    socket.emit('join', `order_${ order._id }`);
}

//Testing code

// let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)
// if(adminAreaPath.includes('admin')){
//     socket.emit('join', 'adminRoom');
// }

socket.on('orderUpdated', (data) => {
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder)
});

