import { useContext } from 'react';
import _get from 'lodash.get';
import CartContext from '../../../../context/Cart/CartContext';

export default function useBraintreeBillingAddressContext(countryList, stateList) {
  const [cartData] = useContext(CartContext);
  const billingAddress = _get(cartData, 'cart.billing_address');

  const addressCountry = billingAddress.country;
  const addressRegion = billingAddress.region;

  const country = countryList.find(c => c.id === addressCountry) || {};
  const state = _get(stateList, country.id, []).find(
      s => s.code === addressRegion
  );
  const countryName = _get(country, 'name', '');
  const stateName = _get(state, 'name', '');

  const options = {
      billingAddress: {
          postalCode: billingAddress.zipcode,
          firstName: billingAddress.firstname,
          lastName: billingAddress.lastname,
          company: billingAddress.company,
          streetAddress: _get(billingAddress, 'street', []).join(),
          locality: billingAddress.city,
          region: stateName,
          countryName: countryName,
      },
      vault: false,
  }

  return {
    options,
  };
}