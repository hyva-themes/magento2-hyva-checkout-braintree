import React, { useEffect, useState, useCallback } from 'react';
import { func, shape, bool } from 'prop-types';

import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeApplePayConfig';
import { ApplePaySession } from 'braintree-web';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientApplePay from 'braintree-web/apple-pay';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import setEmailShippingPayment from '../../api/setEmailShippingPayment';
import {applePayButtonStyle, prepareAddress} from './utility';

function ApplePayButton({ buttonOnly = false }) {
  const { setErrorMessage, appDispatch} = useBraintreeAppContext();
  const { grandTotalAmount } = useBraintreeCartContext();
  const [braintreeApplePayClient, setBraintreeApplePayClient] = useState(null);

  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect( () => {
    async function authoriseBraintree() {
      if ((paymentConfig.clientToken) && (!braintreeApplePayClient)) {
        await BraintreeClient.create({
          authorization: paymentConfig.clientToken
        }).then(function(clientInstance) {
          return BraintreeClientApplePay.create({
            client: clientInstance
          }).then(function(applePayInstance) {
            setBraintreeApplePayClient(applePayInstance);
          }).catch(function(applePayErr) {
            setErrorMessage(applePayErr.message);
            console.error(applePayErr);
          })
        });
      }
    }
    authoriseBraintree();
  }, [braintreeApplePayClient, setErrorMessage]);
  
  const handlePerformApplePay = useCallback(async () => {
    const paymentData = {total: {label: paymentConfig.merchantName, amount: grandTotalAmount}};
    var paymentRequest = braintreeApplePayClient.createPaymentRequest(paymentData);
    if (!paymentRequest) {
        setErrorMessage("We're unable to take payments through Apple Pay at the moment. Please try an alternative payment method.");
        console.error('Braintree ApplePay Unable to create paymentRequest', paymentRequest);
        return;
    }
    // Init apple pay session
    try {
        var session = new window.ApplePaySession(3, paymentRequest);
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
      }).then(function(merchantSession) {
        session.completeMerchantValidation(merchantSession);
      }).catch(function(validationErr) {
        session.abort();
        console.error('Braintree ApplePay Error validating merchant:', validationErr);
        setErrorMessage("We're unable to take payments through Apple Pay at the moment. Please try an alternative payment method.");
      });        
    };

    // Attach payment auth event
    session.onpaymentauthorized = function (event) {
        // If requested, address information is accessible in event.payment
        // and may also be sent to your server.
        console.log('billingPostalCode:', event.payment.billingContact);
        console.log('Your shipping address is:', event.payment.shippingContact);
        let newShippingAddress = prepareAddress(event.payment.shippingContact);
        let emailAddress = 'example@exmaple.com';
        if (event.payment.billingContact.emailAddress) {
          emailAddress = event.payment.billingContact.emailAddress;
        }
        else if (event.payment.shippingContact.emailAddress) {
          emailAddress = event.payment.shippingContact.emailAddress;
        }
        braintreeApplePayClient.tokenize({
          token: event.payment.token
        }).then(function(payload) {
          console.log('nonce:', payload.nonce);
          setEmailShippingPayment(appDispatch,
            emailAddress,
            newShippingAddress,
            'braintree_applepay',
            payload.nonce
          );
          session.completePayment(ApplePaySession.STATUS_SUCCESS);
        }).catch(function(tokenizeErr) {
          console.error('Error tokenizing Apple Pay:', tokenizeErr);
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        });
    };
    session.begin();
  }, [braintreeApplePayClient, setErrorMessage, grandTotalAmount]);

  return (
    <>
      <div className="mx-4 my-4">
        <div className="flex items-center justify-center py-4">
            <button style={applePayButtonStyle}
                    type="button"
                    onClick={handlePerformApplePay}/>                    
        </div>
      </div>
    </>
  );
}

ApplePayButton.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  buttonOnly: bool,
};

export default ApplePayButton;