import { placeOrder } from './apiService.js';
import { CardWidget } from './CardWidget.js';

export function initStripe() {

    //Stripe publishable key
    var stripe = Stripe('');

    let card = null;

    const paymentType = document.querySelector('#paymentType');

    if(!paymentType) {
        return;
    }

    paymentType.addEventListener('change', (e) => {
        

        if(e.target.value === 'card') {
            //Display card widget
            card = new CardWidget(stripe);
            card.mount();
        } else {
            //Remove card widget
            card.destroy();
        }

    });

    //Payment ajax call
    const paymentForm = document.querySelector('#payment-form');

    if(paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
        
            for(let [key, value] of formData.entries()){
                formObject[key] = value;
            }

            if(!card) {
                // Ajax call
                placeOrder(formObject);
                return;
            }

            const token = await card.createToken();
            formObject.stripeToken = token.id;
            placeOrder(formObject);
            
        });
    }
}