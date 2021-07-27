import React, { useEffect, useState, useCallback } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeApplePayConfig';
import BraintreeClient from 'braintree-web/client';
import { ApplePaySession } from 'braintree-web';
import { deviceSupported } from './utility';
import useBraintreeBillingAddressContext from '../../hooks/useBraintreeBillingAddressContext';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCheckoutFormContext from '../../hooks/useBraintreeCheckoutFormContext';
import useBraintreeCC from './hooks/useBraintreeCC';
import setPaymentMethod from './api/setPaymentMethod';

function BraintreeCreditCard({ method, selected, actions }) {
  const { countryList, stateList , setErrorMessage} = useBraintreeAppContext();
  const { registerPaymentAction } = useBraintreeCheckoutFormContext();
  const { grandTotalAmount } = useBraintreeCartContext();
  const { options } = useBraintreeBillingAddressContext(countryList, stateList);
  const { handleCreditCardCheckThenPlaceOrder } = useBraintreeCC(method.code);
  const [braintreeApplePayClient, setBraintreeApplePayClient] = useState(null);

  const isSelected = method.code === selected.code;

  if (!deviceSupported()) {
    return;
  }

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
      if ((isSelected) && (paymentConfig.clientToken) && (!braintreeApplePayClient)) {
        await BraintreeClient.create({ authorization: paymentConfig.clientToken }, (applePayErr, applePayInstance) => {
          if (applePayErr) {
            console.log(applePayErr);
            return;
          } 
          else {
            setBraintreeApplePayClient(applePayInstance);
          }
        });
      }
    }
    authoriseBraintree();
  }, [isSelected, braintreeApplePayClient]);


  const handlePerformApplePay = async () => {
    const paymentData = {total: {label: paymentConfig.merchantName, amount: grandTotalAmount}};

    var paymentRequest = braintreeApplePayClient.createPaymentRequest(paymentData);
    if (!paymentRequest) {
        setErrorMessage("We're unable to take payments through Apple Pay at the moment. Please try an alternative payment method.");
        console.error('Braintree ApplePay Unable to create paymentRequest', paymentRequest);
        return;
    }

    // Init apple pay session
    try {
        var session = new ApplePaySession(1, paymentRequest);
    } catch (err) {
        console.error('Braintree ApplePay Unable to create ApplePaySession', err);
        setErrorMessage("We're unable to take payments through Apple Pay at the moment. Please try an alternative payment method.");
        return false;
    }
    
    // Handle invalid merchant
    session.onvalidatemerchant = function (event) {
        braintreeApplePayClient.performValidation({
            validationURL: event.validationURL,
            displayName: paymentConfig.merchantName,
        }, function (validationErr, merchantSession) {
            if (validationErr) {
                session.abort();
                console.error('Braintree ApplePay Error validating merchant:', validationErr);
                setErrorMessage("We're unable to take payments through Apple Pay at the moment. Please try an alternative payment method.");
                return;
            }
            session.completeMerchantValidation(merchantSession);
        });
    };

    // Attach payment auth event
    session.onpaymentauthorized = function (event) {
        braintreeApplePayClient.tokenize({
            token: event.payment.token
        }, function (tokenizeErr, payload) {
            if (tokenizeErr) {
                console.error('Error tokenizing Apple Pay:', tokenizeErr);
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                return;
            }
            // Send payload.nonce to your server.
            console.log('nonce:', payload.nonce);

            // If requested, address information is accessible in event.payment
            // and may also be sent to your server.
            console.log('billingPostalCode:', event.payment.billingContact.postalCode);

            session.completePayment(ApplePaySession.STATUS_SUCCESS);
        });
    };
    session.begin();
  }  

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
            <div className="flex items-center justify-center py-4">
                <button style="-webkit-appearance: -apple-pay-button; -apple-pay-button-type: plain; display: block;width: 200px;                                  
                                min-height: 40px; border: 1px solid black; background-image: -webkit-named-image(apple-pay-logo-black);
                                background-size: 100% ~'calc(60% + 2px)'; background-repeat: no-repeat; background-color: black;                                    
                                background-position: 50% 50%; border-radius: 5px; padding: 2px; margin: 20px auto;                            
                                transition: background-color .15s; cursor: pointer;"
                        type="button"
                        onClick={handlePerformApplePay}>
                    {__('Pay with Apple Pay')}
                </button>
            </div>
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