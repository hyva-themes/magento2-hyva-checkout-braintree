import _get from 'lodash.get';

import RootElement from '../../../../utils/rootElement';
import { BILLING_ADDR_FORM } from '../../../../../config';


const config = RootElement.getPaymentConfig();
const braintree = _get(config, 'braintree');

export default function getBraintreeBaseConfig() {
  const baseConfig = {
    isActive: _get(braintree, 'isActive', 'false'),
    clientToken: _get(braintree, 'clientToken', ''),
    ccTypesMapper: _get(braintree, 'ccTypesMapper'),
    availableCardTypes: _get(braintree, 'availableCardTypes'),
    useCvv: _get(braintree, 'useCvv'),
    environment: _get(braintree, 'environment'),
    icons: _get(braintree, 'icons'),
  };

  return baseConfig;
}

export function getBillingAddress() {
    const billingAddress = _get(values, BILLING_ADDR_FORM, {});
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
    return options;
}

export const cardImage = {
    base: {
        'position': 'absolute',
        'top': '2em',
        'right': '1em',
        'width': '44px',
        'height': '28px',
        'background-image': 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/346994/card_sprite.png)',
        'background-size': '86px 458px',
        'border-radius': '4px',
        'background-position': '-100px 0',
        'background-repeat': 'no-repeat',
        'margin-bottom': '1em',
    },
    americanexpress: {
        'background-position': '0 -370px',
    },
    visa: {
        'background-position': '0 -398px',
    },
    mastercard: {
        'background-position': '0 -281px',
    },
    discover: {
        'background-position': '0 -163px',
    },
    maestro: {
        'background-position': '0 -251px',
    },
    jcb: {
        'background-position': '0 -221px',
    },
    dinersclub: {
        'background-position': '0 -133px',
    },
};

export const cardForm = {
    base: {
        'background-color': '#FFF',
        'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.12)',
        'padding': '8em 3em 2em',
        'width': '20em',
        'margin-bottom': '2em',
        'transition': 'all 600ms cubic-bezier(.20, 1.3, .7, 1)',
        'z-index': '1',
        'border-radius': '6px',
        'padding': '2em 2em 1em',
        'color': '#fff',
    },
    visa: {
        'background-color': '#0D4AA2',
    },
    americanexpress: {
        'background-color': '#007CC3',
    },
    mastercard: {
        'background-color': '#363636',
        'background': 'linear-gradient(115deg,#d82332, #d82332 50%, #f1ad3d 50%, #f1ad3d)'
    },
    maestro: {
        'background-color': '#363636',
        'background': 'linear-gradient(115deg,#009ddd, #009ddd 50%, #ed1c2e 50%, #ed1c2e)',
    },
    discover: {
        'background-color': '#ff6000',
        'background': 'linear-gradient(#d14310, #f7961e)'
    },
    unionpay: {
        'background-color': '#363636',
    },
    jcb:  {
        'background-color': '#363636',
    },
    dinersclub:  {
        'background-color': '#363636',
    },    
};

export const iFrameStyling = { 'input': {
    'color': '#282c37',
    'font-size': '16px',
    'transition': 'color 0.1s',
  },
  ':focus': {
      'border-color': '#5db6e8'
  },
  // Style the text of an invalid input
  'input.invalid': {
    'color': '#E53A40',
    'border-color': '#E53A40',
    'transform': 'translate3d(0, 0, 0)',
    'backface-visibility': 'hidden',
    'perspective': '1000px',
  
  },
  '.valid': {
      'color': 'green'
  },
  // placeholder styles need to be individually adjusted
  '::-webkit-input-placeholder': {
    'color': 'rgba(0,0,0,0.6)'
  },
  ':-moz-placeholder': {
    'color': 'rgba(0,0,0,0.6)'
  },
  '::-moz-placeholder': {
    'color': 'rgba(0,0,0,0.6)'
  },
  ':-ms-input-placeholder': {
    'color': 'rgba(0,0,0,0.6)'
  },
  // prevent IE 11 and Edge from
  // displaying the clear button
  // over the card brand icon
  'input::-ms-clear': {
    opacity: '0'
  }
};

export const headerStyle = {
    'display': 'flex',
    'z-index': '2',
    'transform': 'translate(0, 5.5em)',
    'transition': 'all .5s ease',
    'transform': 'translate(0, 0)',
};


