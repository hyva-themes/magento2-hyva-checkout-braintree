import { SET_SHIPPING_PAYMENT_MUTATION } from './mutation';
import modifier from './modifier';
import sendRequest from '../sendRequest';
import LocalStorage from '../../../../utils/localStorage';

export default async function setShippingPayment(address, method, nonce) {
  try {
    const variables = { firstname: address.firstname,
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
      await sendRequest({ query: SET_SHIPPING_PAYMENT_MUTATION, variables })
    );
  }
  catch (error) {
    throw error;
  }
}
