import React from 'react';
import { string } from 'prop-types';

import { __ } from '../../../../../i18n';
import paymentConfig  from './braintreeCreditCardConfig';

function getCardTypeImageUrl(cardType) {
    return paymentConfig.icons[cardType].url;
}
function CCIframe({ detectedCardType }) {
  let detectedCard;
  let availableCardTypes = paymentConfig.availableCardTypes;

  detectedCard = availableCardTypes.find(
    cardType => paymentConfig.ccTypesMapper[detectedCardType] === cardType
  );

  if (detectedCard) {
    availableCardTypes = [detectedCard];
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
                  className="w-auto h-8"
                  src={getCardTypeImageUrl(cardType)}
                />
              ))}
            </div>
            <label className="block text-lg mb-2 uppercase" for="card-number">{__('Credit Card Number')}</label>
            <div className="rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1" id="card-number"></div>
        </div>
      </div>

      <div className="flex justify-around">
        <div className="mr-1 w-full transition-transform" >
            <label className="block text-lg mb-2 uppercase" for="expiration-date">{__('Expiry')}</label>
            <div className='rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1' id="expiration-date"></div>
        </div>
        <div className="w-full transition-transform">
            <label className="block text-lg mb-2 uppercase" for="cvv">{__('CVV')}</label>
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