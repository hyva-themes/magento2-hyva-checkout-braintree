import React, { useEffect, useState, useCallback } from 'react';
import { func, shape } from 'prop-types';

import Card from '@hyva/payments/components/common/Card';
import RadioInput from '@hyva/payments/components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeApplePayConfig';
import { ApplePaySession } from 'braintree-web';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientApplePay from 'braintree-web/apple-pay';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import setPaymentMethod from '../../api/setPaymentMethod';


function ApplePay({ method, selected, actions }) {
  const { setErrorMessage} = useBraintreeAppContext();
  const { grandTotalAmount } = useBraintreeCartContext();
  const [braintreeApplePayClient, setBraintreeApplePayClient] = useState(null);

  const isSelected = method.code === selected.code;

  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect( () => {
    async function authoriseBraintree() {
      if ((isSelected) && (paymentConfig.clientToken) && (!braintreeApplePayClient)) {
        await BraintreeClient.create({ authorization: paymentConfig.clientToken }, (err, clientInstance) => {
          if (err) {
            console.log(err);
            return;
          } 
          else {
            BraintreeClientApplePay.create({
                client: clientInstance
              }, function (applePayErr, applePayInstance) {
                if (applePayErr) {
                  console.error('Error creating applePayInstance:', applePayErr);
                  return;
                }
                setBraintreeApplePayClient(applePayInstance);
            });    
          }  
        });
      }
    }
    authoriseBraintree();
  }, [isSelected, braintreeApplePayClient]);


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
        // If requested, address information is accessible in event.payment
        // and may also be sent to your server.
        console.log('billingPostalCode:', event.payment.billingContact.postalCode);
        console.log('Your shipping address is:', event.payment.shippingContact);

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
            setPaymentMethod(method.code, payload.nonce);
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
        });
    };
    session.begin();
  }, [braintreeApplePayClient, setErrorMessage, grandTotalAmount, method.code]);

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

  const buttonStyle = {
    WebkitAppearance: "-apple-pay-button",
    ApplePayButtonType: "plain",
    display: "block",
    width: "200px",                                  
    minHeight: "40px",
    border: "1px solid black",
    backgroundImage: "-webkit-named-image(apple-pay-logo-black)",
    backgroundSize: "100% ~'calc(60% + 2px)'",
    backgroundRepeat: "no-repeat",
    backgroundColor: "black",                                    
    backgroundosition: "50% 50%",
    borderRadius: "5px",
    padding: "2px",
    margin: "20px auto",                            
    transition: "background-color .15s",
    cursor: "pointer"
  }

  return (
    <>
      <div>{radioInputElement}</div>
      <div className="mx-4 my-4">
        <Card bg="darker">
            <div className="flex items-center justify-center py-4">
                <button style={buttonStyle}
                        type="button"
                        onClick={handlePerformApplePay}/>                    
            </div>
        </Card>
      </div>
    </>
  );
}

ApplePay.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default ApplePay;