import { placeOrder } from './apiService.js';
import { CardWidget } from './CardWidget.js';

export function initStripe() {

    var stripe = Stripe('pk_test_51JsUG9Bl4OLn10Gz4H0TuxaBxMFGeQp6ed0dwYKso7yd9OfdaMMSEgFQZRJVQyiF6FtgZhTAXglMbqDEIE3NL3DC00sYDKpsXu');

    let card = null;

    // function mountWidget() {
    //     const elements = stripe.elements();

    //     let style = {
    //         base: {
    //             color: '#cecdca',
    //             fontFamily: '"Poppins", sans-serif',
    //             fontSmoothing: 'antialiased',
    //             fontSize: '1rem',
    //             '::placeholder': {
    //             color: '#aab7c4'
    //             }
    //         },
    //         invalid: {
    //             color: '#fa755a',
    //             iconColor: '#fa755a'
    //         }
    //     };
    
    //     card = elements.create('card', { style, hidePostalCode: true });
    //     card.mount('#card-element');
    // }

    const paymentType = document.querySelector('#paymentType');

    if(!paymentType) {
        return;
    }

    paymentType.addEventListener('change', (e) => {
        

        if(e.target.value === 'card') {
            //Display card widget
            //mountWidget();
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

            // // Verify card
            // stripe.createToken(card).then((result) => {
            //     formObject.stripeToken = result.token.id;
            //     placeOrder(formObject);
            // }).catch((err) => {
            //     console.log(err);
            // });
            
        });
    }
}