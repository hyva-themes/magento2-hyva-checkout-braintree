import React from 'react';
import { string } from 'prop-types';
import _get from 'lodash.get';

import { __ } from '../../../../../i18n';
import getBraintreeBaseConfig, { cardImage }  from '../../utility/braintreeConfig';

function getCardTypeImageUrl(cardId) {
    const { icons } = getBraintreeBaseConfig();
    cardURL = icons.find(cardType => cardType === cardId);
    return cardUrl.url;
}

function CCIframe({ detectedCardType }) {
  const { availableCardTypes } = getBraintreeBaseConfig();
  let detectedCard, newCardImage;

  detectedCard = creditCardConfig.availableCardTypes.find(
    cardType => cardType.id.toUpperCase() === detectedCardType
  );

  if (detectedCard) {
    availableCardTypes = [detectedCard];
    newCardImage = Object.assign(cardImage['base'],cardImage[detectedCardType]);
  }

  return (
    <>
      <div className="mt-2">
        <div className="relative transition-transform">
            <div className="flex space-x-2">
              {availableCardTypes.map(cardType => (
                <img
                  key={cardType}
                  alt={cardType}
                  className="w-auto h-3"
                  src={getCardTypeImageUrl(cardType)}
                />
              ))}
            </div>
            <label className="block text-lg mb-2 uppercase" for="card-number">{__('Credit Card Number')}</label>
            <div className="rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1" id="card-number"></div>
            <div id="card-image" style={newCardImage}></div>
        </div>
      </div>

      <div className="flex justify-around">
        <div className="mr-1 w-full transition-transform" >
            <label className="block text-lg mb-2 uppercase" for="expiration-date">{__('Expiration Date')}</label>
            <div className='rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1' id="expiration-date"></div>
        </div>
        <div className="w-full transition-transform">
            <label className="block text-lg mb-2 uppercase" for="cvv">{__('Card Verification Number')}</label>
            <div className='rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1' id="cvv"></div>
        </div>
      </div>  
    </>
  );
}

CCIframe.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCIframe;