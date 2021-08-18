import CreditCardWrapper from './src/components/BraintreeCreditCard';
import ApplePayWrapper from './src/components/BraintreeApplePay';
import GooglePayWrapper from './src/components/BraintreeGooglePay';
import PayPalWrapper from './src/components/BraintreePayPal/PayPalWrapper';

export default {
    braintree: CreditCardWrapper,
    braintree_applepay: ApplePayWrapper,
    braintree_googlepay: GooglePayWrapper,
    braintree_paypal: PayPalWrapper,
};
