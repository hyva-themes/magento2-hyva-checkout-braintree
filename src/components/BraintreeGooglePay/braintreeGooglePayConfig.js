import RootElement from '../../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();
const brainTree = config.braintree_googlepay;
const {
  environment,
  clientToken,
  merchantId,
  cardTypes,
  btnColor,
  paymentMarkSrc,
} = brainTree;

const paymentConfig = {
  environment,
  clientToken,
  merchantId,
  cardTypes,
  btnColor,
  paymentMarkSrc,
};

export default paymentConfig;
