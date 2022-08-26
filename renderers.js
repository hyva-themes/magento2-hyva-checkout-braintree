import CreditCardWrapper from './src/components/BraintreeCreditCard';
import ApplePayWrapper from './src/components/BraintreeApplePay';
import GooglePay from './src/components/BraintreeGooglePay';
import PayPalWrapper from './src/components/BraintreePayPal/PayPalWrapper';

export default {
  braintree: CreditCardWrapper,
  braintree_applepay: ApplePayWrapper,
  braintree_googlepay: GooglePay,
  braintree_paypal: PayPalWrapper,
};
