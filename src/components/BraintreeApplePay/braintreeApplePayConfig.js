
import RootElement from '../../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();
const brainTree = config.braintree_applepay;
const {
  clientToken,
  merchantName,
  paymentMarkSrc,
} = brainTree;

const paymentConfig = {
  clientToken,
  merchantName,
  paymentMarkSrc,
};

export default paymentConfig;