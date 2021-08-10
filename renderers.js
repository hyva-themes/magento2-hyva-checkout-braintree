import CreditCard from './src/components/BraintreeCreditCard';
import ApplePayWrapper from './src/components/BraintreeApplePay';
import GooglePayWrapper from './src/components/BraintreeGooglePay';

export default {
    braintree: CreditCard,
    braintree_applepay: ApplePayWrapper,
    braintree_googlepay: GooglePayWrapper,
};
