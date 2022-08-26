import CreditCard from './src/components/BraintreeCreditCard';
import ApplePay from './src/components/BraintreeApplePay';
import GooglePay from './src/components/BraintreeGooglePay';
import PayPal from './src/components/BraintreePayPal';

export default {
  braintree: CreditCard,
  braintree_applepay: ApplePay,
  braintree_googlepay: GooglePay,
  braintree_paypal: PayPal,
};
