import env from '../../../../../../utils/env';

export function prepareAddress(address) {
  let phoneNumber = '0000000000';
  if (typeof address.phone !== 'undefined') {
    phoneNumber = address.phone;
  }
  return {
    company: '',
    firstname: address.shippingAddress.recipientName.split(' ').slice(0, -1).join(' '),
    lastname: address.shippingAddress.recipientName.split(' ').slice(-1).join(' '),
    street: [address.shippingAddress.line1, address.shippingAddress.line2],
    phone: phoneNumber,
    zipcode: address.shippingAddress.postalCode,
    city: address.shippingAddress.city,
    region: address.shippingAddress.state.toUpperCase(),
    country: address.shippingAddress.countryCode,
  };
}

export function getCreatePaymentOptions(
  formSectionErrors,
  formSectionValues,
  grandTotalAmount
) {
  const paymentOptions = {
    flow: 'checkout', // Required
    amount: grandTotalAmount, // Required
    currency: env.currencyCode, // Required, must match the currency passed in with loadPayPalSDK
    intent: 'capture', // Must match the intent passed in with loadPayPalSDK
    enableShippingAddress: true,
    shippingAddressEditable: true,
    ...((typeof formSectionErrors === 'undefined') && {
      shippingAddressOverride: {
        recipientName: formSectionValues.fullName,
        line1: formSectionValues.street[0],
        city: formSectionValues.city,
        countryCode: formSectionValues.country,
        postalCode: formSectionValues.zipcode,
        state: formSectionValues.region,
        phone: formSectionValues.phone
      }
    }),
  };
  return paymentOptions;
}

/* Indicates how PayPal button will appear */
export const payPalButtonStyle = {
  layout: 'horizontal',
  color: 'gold',
  shape: 'rect',
  size: 'responseive',
  label: 'pay',
};
