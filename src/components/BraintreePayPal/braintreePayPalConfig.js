
import RootElement from '../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();
const braintree = config.braintree;
const braintree_paypal = config.braintree_paypal;
const { clientToken } = braintree;
const {
  isActive,
  title,
  isAllowShippingAddressOverride,
  merchantName,
  locale,
  paymentAcceptanceMarkSrc,
  vaultCode,
  paymentIcon
} = braintree_paypal;

const paymentConfig = {
  isActive,
  clientToken,
  title,
  isAllowShippingAddressOverride,
  merchantName,
  locale,
  paymentAcceptanceMarkSrc,
  vaultCode,
  paymentIcon
};

export default paymentConfig;