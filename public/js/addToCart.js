
//Add to cart button
let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(items){
    axios.post('/update-cart', items).then(res => {
        
        cartCounter.innerText = res.data.totalQty;
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let items = JSON.parse(btn.dataset.items);
        updateCart(items);
    })
})