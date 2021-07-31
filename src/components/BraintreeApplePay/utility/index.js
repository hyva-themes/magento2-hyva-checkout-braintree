
export function deviceSupported() {
    if (window.location.protocol !== 'https:') {
        console.warn("Braintree Apple Pay requires your checkout be served over HTTPS");
        return false;
    }

    if ((window.ApplePaySession && window.ApplePaySession.canMakePayments()) !== true) {
        console.warn("Braintree Apple Pay is not supported on this device/browser");
        return false;
    }
    return true;
}