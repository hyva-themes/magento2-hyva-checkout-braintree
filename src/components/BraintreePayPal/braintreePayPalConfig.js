import RootElement from '../../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();
const { braintree, braintreePaypal } = config;
const { clientToken } = braintree;
const {
  isActive,
  title,
  isAllowShippingAddressOverride,
  merchantName,
  locale,
  paymentAcceptanceMarkSrc,
  vaultCode,
  paymentIcon,
} = braintreePaypal;

const paymentConfig = {
  isActive,
  clientToken,
  title,
  isAllowShippingAddressOverride,
  merchantName,
  locale,
  paymentAcceptanceMarkSrc,
  vaultCode,
  paymentIcon,
};

export default paymentConfig;
