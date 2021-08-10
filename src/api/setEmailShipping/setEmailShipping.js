import { SET_EMAIL_SHIPPING_MUTATION } from './mutation';
import modifier from './modifier';
import sendRequest from '../sendRequest';
import LocalStorage from '@hyva/payments/utils/localStorage';

export default async function setEmailShipping(email, address) {
  try {
    const variables = { email: email,
                        firstname: address.firstname,
                        lastname: address.lastname,
                        company: address.company,
                        street: address.street,
                        city: address.city,
                        region: address.region,
                        postcode: address.zipcode,
                        country_code: address.country,
                        telephone: address.phone,
                        cartId: LocalStorage.getCartId() };
    return modifier(
      await sendRequest({ query: SET_EMAIL_SHIPPING_MUTATION, variables })
    );
  }
  catch (error) {
    throw error;
  }
}
