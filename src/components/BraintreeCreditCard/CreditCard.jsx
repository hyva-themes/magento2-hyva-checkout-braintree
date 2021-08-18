import React, { useEffect, useState, useCallback } from 'react';
import { func, shape } from 'prop-types';

import Card from '@hyva/payments/components/common/Card';
import RadioInput from '@hyva/payments/components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeCreditCardConfig';
import BraintreeClient from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';
import useBraintreeBillingAddressContext from '../../hooks/useBraintreeBillingAddressContext';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCheckoutFormContext from '../../hooks/useBraintreeCheckoutFormContext';
import useBraintreeCC from './hooks/useBraintreeCC';
import setPaymentMethod from '../../api/setPaymentMethod';
import { getCardTypeImageUrl, hostedFieldsStyle, hostedFieldsDefinition } from './utility';
function CreditCard({ method, selected, actions }) {
  const { countryList, stateList, setErrorMessage } = useBraintreeAppContext();
  const { registerPaymentAction } = useBraintreeCheckoutFormContext();
  const { options } = useBraintreeBillingAddressContext(countryList, stateList);
  const { handleCreditCardCheckThenPlaceOrder } = useBraintreeCC(method.code);
  const [ isCCValid, setCCValid ] = useState(false);
  const [braintreeClient, setBraintreeClient] = useState(null);
  const [braintreeHostedFields, setBraintreeHostedFields] = useState(null);
  const [creditCardNonce, setCreditCardNonce] = useState(null)
  const [cardType, setCardType] = useState(null);
  const isSelected = method.code === selected.code;

  /**
   * This will be fired when user placing the order and this payment method
   * is selected by the user.
   */
   const paymentSubmitHandler = useCallback(
    async (values,braintreeHostedFields) => {
      await handleCreditCardCheckThenPlaceOrder(values,braintreeHostedFields);
      return false;
    },
    [handleCreditCardCheckThenPlaceOrder]
  );

  // registering this payment method so that it will be using the paymentSubmitHandler
  // to do the place order action in the case this payment method is selected.
  useEffect(() => {
    registerPaymentAction(method.code, paymentSubmitHandler);
  }, [method, registerPaymentAction, paymentSubmitHandler]);

  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect( () => {
    async function authoriseBraintree() {
      if ((isSelected) && (paymentConfig.clientToken) && (!braintreeClient)) {
        await BraintreeClient.create({
              authorization: paymentConfig.clientToken
        }).then(function(clientInstance) {
            setBraintreeClient(clientInstance);
            var options = {
              client: clientInstance,
              styles: hostedFieldsStyle,
              fields: hostedFieldsDefinition,
            };
            return HostedFields.create(options);
        }).then(function(hostedFieldsInstance) {
          setBraintreeHostedFields(hostedFieldsInstance);
          hostedFieldsInstance.on('validityChange', function (event) {
            setCCValid(Object.keys(event.fields).every(function (key) {
              return event.fields[key].isValid;
            }));
          });
          hostedFieldsInstance.on('empty', function (event) {
            if (event.emittedBy === 'number') {
              setCardType('');
            }
          });
          hostedFieldsInstance.on('cardTypeChange', function (event) {
            if (event.cards.length === 1) {
                setCardType(event.cards[0].type);
                // Change the CVV length for AmericanExpress cards
                if (event.cards[0].code.size === 4) {
                  hostedFieldsInstance.setAttribute({field: 'cvv',attribute: 'placeholder', value: '1234'});
                } 
            } else {
              hostedFieldsInstance.setAttribute({field: 'cvv',attribute: 'placeholder', value: '123'});
            }
          });
        }).catch(function(error) {
          setErrorMessage(error.message);
        });
      }
    }
    authoriseBraintree();
  }, [isSelected, braintreeClient, setCCValid, setCardType, setErrorMessage]);

  // If braintree is not selected reset client
  useEffect( () => {
    if ((!isSelected) && (braintreeClient)) {
        setBraintreeClient(null);
        setBraintreeHostedFields(null);
        setCreditCardNonce(null)
    }
  },[isSelected,braintreeClient]);

  // The iFrame form is valid and we don't have a nonce set tokenise the frame
  // and send the nonce to the server
  useEffect(() => {
    if ((isCCValid) && (!creditCardNonce)) {
      braintreeHostedFields.tokenize(options)
      .then(function(payload) {
        setPaymentMethod(method.code,payload.nonce);
        setCreditCardNonce(payload.nonce);
      }).catch(function(error) {
        setErrorMessage(error.message);
      });
    }
  }, [isCCValid, braintreeHostedFields, options, method.code, setErrorMessage, creditCardNonce]);

  const radioInputElement = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (!isSelected) {
    return (
      <>
        {radioInputElement}
      </>
    );
  }

  let detectedCard;
  let availableCardTypes = paymentConfig.availableCardTypes;

  detectedCard = availableCardTypes.find(
    availableCard => paymentConfig.ccTypesMapper[cardType] === availableCard
  );

  if (detectedCard) {
    availableCardTypes = [detectedCard];
  }

  return (
    <>
      <div>{radioInputElement}</div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="w-full">
            <div className="mt-2">
              <div className="relative transition-transform">
                <div className="flex space-x-2">
                  {availableCardTypes.map(availableCard => (
                    <img
                      key={availableCard}
                      alt={availableCard}
                      className="w-auto h-8"
                      src={getCardTypeImageUrl(availableCard)}
                    />
                  ))}
                </div>
                <label className="block text-lg mb-2 uppercase" for="card-number">Credit Card Number</label>
                <div className="rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1" id="card-number"></div>
              </div>
            </div>

            <div className="flex justify-around">
              <div className="mr-1 w-full transition-transform" >
                  <label className="block text-lg mb-2 uppercase" for="expiration-date">Expiry</label>
                  <div className='rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1' id="expiration-date"></div>
              </div>
              <div className="w-full transition-transform">
                  <label className="block text-lg mb-2 uppercase" for="cvv">CVV</label>
                  <div className='rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1' id="cvv"></div>
              </div>
            </div>  
          </div>
        </Card>
      </div>
    </>
  );
}

CreditCard.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default CreditCard;