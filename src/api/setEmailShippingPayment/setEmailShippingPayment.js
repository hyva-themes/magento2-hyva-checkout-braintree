import sendRequest from '@hyva/react-checkout/api/sendRequest';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import { SET_EMAIL_SHIPPING_MUTATION } from './mutation';
import modifier from './modifier';

export default async function setEmailShippingPayment(
  dispatch,
  email,
  address,
  method,
  nonce
) {
  const variables = {
    email,
    firstname: address.firstname,
    lastname: address.lastname,
    company: address.company,
    street: address.street,
    city: address.city,
    region: address.region,
    postcode: address.zipcode,
    country_code: address.country,
    telephone: address.phone,
    cartId: LocalStorage.getCartId(),
    code: method,
    payment_method_nonce: nonce,
  };
  return modifier(
    await sendRequest(dispatch, {
      query: SET_EMAIL_SHIPPING_MUTATION,
      variables,
    })
  );
}
