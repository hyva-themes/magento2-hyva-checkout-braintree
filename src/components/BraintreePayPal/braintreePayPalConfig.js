import { get as _get } from 'lodash-es';
import RootElement from '@hyva/react-checkout/utils/rootElement';

const config = RootElement.getPaymentConfig();
const braintreePaypal = _get(config, 'braintree_paypal');
const braintree = _get(config, 'braintree');
const paymentConfig = {
  isActive: _get(braintreePaypal, 'isActive', false),
  clientToken: _get(braintree, 'clientToken', ''),
  title: _get(braintreePaypal, 'title', ''),
  isAllowShippingAddressOverride: _get(
    braintreePaypal,
    'isAllowShippingAddressOverride',
    false
  ),
  merchantName: _get(braintreePaypal, 'merchantName', ''),
  locale: _get(braintreePaypal, 'locale', ''),
  paymentAcceptanceMarkSrc: _get(
    braintreePaypal,
    'paymentAcceptanceMarkSrc',
    ''
  ),
  vaultCode: _get(braintreePaypal, 'vaultCode', ''),
  paymentIcon: _get(braintreePaypal, 'paymentIcon', ''),
};

export default paymentConfig;
