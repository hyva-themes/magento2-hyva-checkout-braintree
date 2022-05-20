export function deviceSupported() {
  if (window.location.protocol !== 'https:') {
    console.warn(
      "Braintree Apple Pay requires your checkout be served over HTTPS"
    );
    return false;
  }

  if ((window.ApplePaySession && window.ApplePaySession.canMakePayments()) !== true) {
    console.warn('Braintree Apple Pay is not supported on this device/browser');
    return false;
  }
  return true;
}

export function prepareAddress(address) {
  return {
    company: '',
    firstname: address.givenName,
    lastname: address.familyName,
    street: address.addressLines,
    phone: address.phoneNumber,
    zipcode: address.postalCode,
    city: address.locality,
    region: address.administrativeArea,
    country: address.countryCode,
  };
}

export const applePayButtonStyle = {
  WebkitAppearance: '-apple-pay-button',
  ApplePayButtonType: 'plain',
  display: 'block',
  width: '200px',
  minHeight: '40px',
  border: '1px solid black',
  backgroundImage: '-webkit-named-image(apple-pay-logo-black)',
  backgroundSize: "100% ~'calc(60% + 2px)'",
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'black',
  backgroundosition: '50% 50%',
  borderRadius: '5px',
  padding: '2px',
  margin: '20px auto',
  transition: 'background-color .15s',
  cursor: 'pointer',
};
