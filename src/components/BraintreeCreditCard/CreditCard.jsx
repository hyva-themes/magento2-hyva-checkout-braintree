import React, { useEffect, useState } from 'react';
import { func, shape } from 'prop-types';
import BraintreeClient from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';
import paymentConfig from './braintreeCreditCardConfig';
import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import useBraintreeBillingAddressContext from '../../hooks/useBraintreeBillingAddressContext';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import setPaymentMethod from '../../api/setPaymentMethod';
import {
  getCardTypeImageUrl,
  hostedFieldsStyle,
  hostedFieldsDefinition,
} from './utility';

function CreditCard({ method, selected, actions }) {
  const { countryList, stateList, setErrorMessage } = useBraintreeAppContext();
  const { braintreeOptions } = useBraintreeBillingAddressContext(
    countryList,
    stateList
  );
  const [braintreeClient, setBraintreeClient] = useState(null);
  const [cardType, setCardType] = useState(null);
  const isSelected = method.code === selected.code;

  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect(() => {
    async function authoriseBraintree() {
      if (isSelected && paymentConfig.clientToken && !braintreeClient) {
        await BraintreeClient.create({
          authorization: paymentConfig.clientToken,
        })
          .then(function createHostedFields(clientInstance) {
            setBraintreeClient(clientInstance);
            const fieldsOptions = {
              client: clientInstance,
              styles: hostedFieldsStyle,
              fields: hostedFieldsDefinition,
            };
            return HostedFields.create(fieldsOptions);
          })
          .then(function customiseHostedFields(hostedFieldsInstance) {
            hostedFieldsInstance.on(
              'validityChange',
              function setValidityChangeEvent(event) {
                const formValid = Object.keys(event.fields).every(
                  function checkFields(key) {
                    return event.fields[key].isValid;
                  }
                );
                if (formValid) {
                  hostedFieldsInstance
                    .tokenize(braintreeOptions)
                    .then(function setMagentoPaymentMethod(payload) {
                      setPaymentMethod(method.code, payload.nonce);
                    })
                    .catch(function setMagentoPaymentError(error) {
                      setErrorMessage(error.message);
                    });
                }
              }
            );
            hostedFieldsInstance.on('empty', function setCardTypeEmpty(event) {
              if (event.emittedBy === 'number') {
                setCardType('');
              }
            });
            hostedFieldsInstance.on(
              'cardTypeChange',
              function setCardTypeChange(event) {
                if (event.cards.length === 1) {
                  setCardType(event.cards[0].type);
                  // Change the CVV length for AmericanExpress cards
                  if (event.cards[0].code.size === 4) {
                    hostedFieldsInstance.setAttribute({
                      field: 'cvv',
                      attribute: 'placeholder',
                      value: '1234',
                    });
                  }
                } else {
                  hostedFieldsInstance.setAttribute({
                    field: 'cvv',
                    attribute: 'placeholder',
                    value: '123',
                  });
                }
              }
            );
          })
          .catch(function setBraintreeError(error) {
            setErrorMessage(error.message);
          });
      }
    }
    authoriseBraintree();
  }, [isSelected, braintreeClient, setCardType, setErrorMessage]);

  // If braintree is not selected reset client
  useEffect(() => {
    if (!isSelected && braintreeClient) {
      setBraintreeClient(null);
    }
  }, [isSelected, braintreeClient]);

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        name="paymentMethod"
        checked={isSelected}
        onChange={actions.change}
      />
    );
  }

  let { availableCardTypes } = paymentConfig;
  const detectedCard = availableCardTypes.find(
    (availableCard) => paymentConfig.ccTypesMapper[cardType] === availableCard
  );

  if (detectedCard) {
    availableCardTypes = [detectedCard];
  }

  return (
    <>
      <div>
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={actions.change}
        />
      </div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="w-full">
            <div className="mt-2">
              <div className="relative transition-transform">
                <div className="flex space-x-2">
                  {availableCardTypes.map((availableCard) => (
                    <img
                      key={availableCard}
                      alt={availableCard}
                      className="w-auto h-8"
                      src={getCardTypeImageUrl(availableCard)}
                      label="card image"
                    />
                  ))}
                </div>
                <span
                  className="block text-lg mb-2 uppercase"
                  htmlFor="card-number"
                  label="credit card number"
                >
                  Credit Card Number
                </span>
                <div
                  className="rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1"
                  id="card-number"
                  label="card number"
                />
              </div>
            </div>
            <div className="flex justify-around">
              <div className="mr-1 w-full transition-transform">
                <span
                  className="block text-lg mb-2 uppercase"
                  htmlFor="expiration-date"
                >
                  Expiry
                </span>
                <div
                  className="rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1"
                  id="expiration-date"
                  label="expiration date"
                />
              </div>
              <div className="w-full transition-transform">
                <span className="block text-lg mb-2 uppercase" htmlFor="cvv">
                  CVV
                </span>
                <div
                  className="rounded bg-white h-12 border-2 border-gray-200 shadow-inner pt-2 pl-3 mb-1"
                  id="cvv"
                  label="cvv"
                />
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

CreditCard.defaultProps = {
  actions: '',
};

export default CreditCard;
