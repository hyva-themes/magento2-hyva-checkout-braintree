import { get as _get } from 'lodash-es';
import RootElement from '@hyva/react-checkout/utils/rootElement';

const config = RootElement.getPaymentConfig();
const brainTree = _get(config, 'braintree');
const paymentConfig = {
  isActive: _get(brainTree, 'isActive', false),
  clientToken: _get(brainTree, 'clientToken', ''),
  ccTypesMapper: _get(brainTree, 'ccTypesMapper', []),
  availableCardTypes: _get(brainTree, 'availableCardTypes', []),
  useCvv: _get(brainTree, 'useCvv', false),
  environment: _get(brainTree, 'environment', false),
  icons: _get(brainTree, 'icons', []),
};

export default paymentConfig;
