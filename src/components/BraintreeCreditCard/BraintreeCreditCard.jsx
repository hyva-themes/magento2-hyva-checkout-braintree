import React, { useEffect, useState, useCallback } from 'react';
import { func, shape } from 'prop-types';

import CCForm from './CCForm';
import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeCreditCardConfig';
import BraintreeClient from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';
import useBraintreeBillingAddressContext from '../../hooks/useBraintreeBillingAddressContext';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCheckoutFormContext from '../../hooks/useBraintreeCheckoutFormContext';
import useBraintreeCC from './hooks/useBraintreeCC';
import setPaymentMethod from './api/setPaymentMethod';
function BraintreeCreditCard({ method, selected, actions }) {
  const { countryList, stateList } = useBraintreeAppContext();
  const { registerPaymentAction } = useBraintreeCheckoutFormContext();
  const { options } = useBraintreeBillingAddressContext(countryList, stateList);
  const { handleCreditCardCheckThenPlaceOrder } = useBraintreeCC(method.code);
  const [ iFrameValid, setIFrameValid ] = useState(false);
  const [braintreeClient, setBraintreeClient] = useState(null);
  const [braintreeHostedFields, setBraintreeHostedFields] = useState(null);
  const [cardType, setCardType] = useState(null);

  const isSelected = method.code === selected.code;

  console.log(iFrameValid);

  /**
   * This will be fired when user placing the order and this payment method
   * is selected by the user.
   */
   const paymentSubmitHandler = useCallback(
    async values => {
      await handleCreditCardCheckThenPlaceOrder(values);
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
        await BraintreeClient.create({ authorization: paymentConfig.clientToken }, (err, clientInstance) => {
          if (err) {
            console.log(err);
          } 
          else {
            setBraintreeClient(clientInstance);
            HostedFields.create({
                client: clientInstance,
                styles: { 'input': {
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
              },
                fields: {
                  number: { selector: '#card-number', placeholder: '4444 3333 2222 1111' },
                  cvv: {selector: '#cvv', placeholder: '123' },
                  expirationDate: { selector: '#expiration-date', placeholder: '08/2025' }
                },
              }, (err, hostedFields) => {
                if (err) {
                    console.log(err);
                    return;
                }
                setBraintreeHostedFields(hostedFields);
                hostedFields.on('validityChange', function (event) {
                  setIFrameValid(Object.keys(event.fields).every(function (key) {
                    return event.fields[key].isValid;
                  }));   
                });
                hostedFields.on('empty', function (event) {
                  if (event.emittedBy === 'number') {
                    setCardType('');
                  }
                });
                hostedFields.on('cardTypeChange', function (event) {
                    if (event.cards.length === 1) {
                        setCardType(event.cards[0].type);
                        // Change the CVV length for AmericanExpress cards
                        if (event.cards[0].code.size === 4) {
                          hostedFields.setAttribute({field: 'cvv',attribute: 'placeholder', value: '1234'});
                        } 
                    } else {
                        hostedFields.setAttribute({field: 'cvv',attribute: 'placeholder', value: '123'});
                    }
                });
            });
          }
        });
      }
    }
    authoriseBraintree();
  }, [isSelected, braintreeClient, setIFrameValid, setCardType]);

  // The iFrame form is valid and we don't have a nonce set tokenise the frame
  // and send the nonce to the server
  useEffect(() => {
    if (iFrameValid) {
      braintreeHostedFields.tokenize(options, (err, payload) => {
        if (err) {
            console.log(err);
        } else {
          console.log("setting the nonce again");
          setPaymentMethod(method.code,payload.nonce);
        }
      });
    }
  }, [iFrameValid, braintreeHostedFields, options, method.code ]);

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

  return (
    <>
      <div>{radioInputElement}</div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <CCForm detectedCardType={cardType} />
        </Card>
      </div>
    </>
  );
}

BraintreeCreditCard.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default BraintreeCreditCard;