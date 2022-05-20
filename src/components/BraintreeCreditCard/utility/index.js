import paymentConfig from '../braintreeCreditCardConfig';

export function validate(hostedFieldsInstance) {
  const state = hostedFieldsInstance.getState();
  const formValid = Object.keys(state.fields).every(function (key) {
    return state.fields[key].isValid;
  });
  if (!formValid) {
    return {
      isValid: false,
      message: 'Make sure the Credit Card fields are filled in correctly',
    };
  }
  return {
    isValid: true,
  };
}

export function getCardTypeImageUrl(cardType) {
  return paymentConfig.icons[cardType].url;
}

export const hostedFieldsDefinition = {
  number: {
    selector: '#card-number',
    placeholder: '4444 3333 2222 1111',
  },
  cvv: {
    selector: '#cvv',
    placeholder: '123',
  },
  expirationDate: {
    selector: '#expiration-date',
    placeholder: '11/2025',
  },
};

export const hostedFieldsStyle = {
  input: {
    color: '#282c37',
    fontSize: '16px',
    transition: 'color 0.1s',
  },
  ':focus': {
    'border-color': '#5db6e8',
  },
  // Style the text of an invalid input
  'input.invalid': {
    color: '#E53A40',
    'border-color': '#E53A40',
    transform: 'translate3d(0, 0, 0)',
    'backface-visibility': 'hidden',
    perspective: '1000px',
  },
  '.valid': {
    color: 'green'
  },
  // placeholder styles need to be individually adjusted
  '::-webkit-input-placeholder': {
    color: 'rgba(0,0,0,0.6)'
  },
  ':-moz-placeholder': {
    color: 'rgba(0,0,0,0.6)'
  },
  '::-moz-placeholder': {
    color: 'rgba(0,0,0,0.6)'
  },
  ':-ms-input-placeholder': {
    color: 'rgba(0,0,0,0.6)'
  },
  // prevent IE 11 and Edge from
  // displaying the clear button
  // over the card brand icon
  'input::-ms-clear': {
    opacity: '0',
  },
};
