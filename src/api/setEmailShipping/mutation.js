import { CART_DATA_FRAGMENT } from '@hyva/payments/api/cart/utility/query/cartQueryInfo';

export const SET_EMAIL_SHIPPING_MUTATION = `
mutation setEmailShippingMutation (
  $cartId: String!,
  $email: String!,
  $firstname: String!,
  $lastname: String!,
  $company: String,
  $street: [String]!,
  $city: String!,
  $region: String,
  $postcode: String,
  $country_code: String!,
  $telephone: String!,
) {
  setGuestEmailOnCart(
    input: {
      cart_id: $cartId
      email: $email
    }
  ) {
    cart {
      email
    }
  }
  setShippingAddressesOnCart(
    input: {
      cart_id: $cartId
      shipping_addresses: [
        {
          address: {
            firstname: $firstname
            lastname: $lastname
            company: $company
            street: $street
            city: $city
            region: $region
            postcode: $postcode
            country_code: $country_code
            telephone: $telephone
            save_in_address_book: false
          }
        }
      ]
    }
  ) {
    cart {
      ${CART_DATA_FRAGMENT}
    }
  }
}
`;
