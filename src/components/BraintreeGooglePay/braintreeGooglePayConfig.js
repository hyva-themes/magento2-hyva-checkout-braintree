import RootElement from '../../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();

const brainTree = _get(config,'braintree_googlepay');
const paymentConfig = {
  isActive: _get(brainTree,'isActive', false),
  environment: _get(brainTree,'environment', ''),
  clientToken: _get(brainTree,'clientToken', ''),
  merchantId: _get(brainTree,'merchantId', ''),
  cardTypes: _get(brainTree,'cardTypes', []),
  btnColor: _get(brainTree,'btnColor', ''),
  paymentMarkSrc: _get(brainTree,'paymentMarkSrc', []),
};

export default paymentConfig;
