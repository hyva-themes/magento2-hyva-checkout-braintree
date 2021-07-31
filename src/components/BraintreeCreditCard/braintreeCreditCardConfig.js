
import RootElement from '@hyva/payments/utils/rootElement';

const config = RootElement.getPaymentConfig();
const brainTree = config.braintree;
const {
  isActive,
  clientToken,
  ccTypesMapper,
  useCvv,
  environment,
  icons,
  availableCardTypes,
} = brainTree;

const paymentConfig = {
  isActive,
  clientToken,
  ccTypesMapper,
  availableCardTypes,
  useCvv,
  environment,
  icons,
};

export default paymentConfig;