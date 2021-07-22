import { __ } from '../../../../../../i18n';

export function validate(braintreeNonce) {
    if (!braintreeNonce) {
        return {
        isValid: false,
        message: __('Error communicating with Braintree Payment Gateway'),
        };
    }
    return { isValid: true };
}