import { get as _get } from 'lodash-es';
import RootElement from '@hyva/react-checkout/utils/rootElement';

const config = RootElement.getPaymentConfig();
const brainTree = _get(config, 'braintree_applepay');
const paymentConfig = {
  isActive: _get(brainTree, 'isActive', false),
  clientToken: _get(brainTree, 'clientToken', ''),
  merchantName: _get(brainTree, 'merchantName', []),
  paymentMarkSrc: _get(brainTree, 'paymentMarkSrc', []),
};

export default paymentConfig;
