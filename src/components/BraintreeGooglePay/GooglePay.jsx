import React, { useEffect, useState, useCallback } from 'react';
import { func, shape } from 'prop-types';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientGooglePay from 'braintree-web/google-payment';
import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeGooglePayConfig';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import setEmailShippingPayment from '../../api/setEmailShippingPayment';
import { prepareAddress, gPayButtonStyle } from './utility';
import env from '../../../../../utils/env';

function GooglePay({ method, selected, actions }) {
  const { setErrorMessage } = useBraintreeAppContext();
  const { grandTotalAmount, setCartInfo } = useBraintreeCartContext();
  const [braintreeGooglePayClient, setBraintreeGooglePayClient] =
    useState(null);
  const [gPayLoaded, setGPayLoaded] = useState(false);
  const [gPayButtonReady, setgPayButtonReady] = useState(false);
  const isSelected = method.code === selected.code;

  let paymentsClient;

  // add the gpay script in
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => {
      setGPayLoaded(true);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (gPayLoaded) {
    paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: paymentConfig.environment,
    });
  }

  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect(() => {
    async function authoriseBraintree() {
      if (
        isSelected &&
        paymentConfig.clientToken &&
        !braintreeGooglePayClient &&
        paymentsClient
      ) {
        await BraintreeClient.create(
          {
            authorization: paymentConfig.clientToken,
          },
          (err, clientInstance) => {
            if (err) {
              setErrorMessage(err);
            } else {
              BraintreeClientGooglePay.create({
                client: clientInstance,
                googlePayVersion: 2,
                googleMerchantId: paymentConfig.merchantId,
              })
                .then(function (googlePaymentInstance) {
                  setBraintreeGooglePayClient(googlePaymentInstance);
                  return paymentsClient.isReadyToPay({
                    // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: paymentConfig.cardTypes,
                    existingPaymentMethodRequired: true,
                  });
                })
                .then(function (isReadyToPay) {
                  if (isReadyToPay.result) {
                    // need to put something here to make sure the button is valid
                    setgPayButtonReady(true);
                  }
                })
                .catch(function (error) {
                  // Handle creation errors
                  setErrorMessage(error);
                });
            }
          }
        );
      }
    }
    authoriseBraintree();
  }, [isSelected, paymentsClient, braintreeGooglePayClient, setErrorMessage]);

  const handlePerformGooglePay = useCallback(async () => {
    const paymentDataRequest =
      braintreeGooglePayClient.createPaymentDataRequest({
        transactionInfo: {
          currencyCode: env.currencyCode,
          totalPriceStatus: 'ESTIMATED',
          totalPrice: String(grandTotalAmount), // Your amount
        },
        emailRequired: true,
        shippingAddressRequired: true,
        shippingAddressParameters: { phoneNumberRequired: true },
      });
    const cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
    cardPaymentMethod.parameters.billingAddressRequired = true;
    cardPaymentMethod.parameters.billingAddressParameters = {
      format: 'FULL',
      phoneNumberRequired: true,
    };
    paymentsClient
      .loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        const newShippingAddress = prepareAddress(paymentData.shippingAddress);
        if (paymentData.email && paymentData.shippingAddress) {
          try {
            braintreeGooglePayClient
              .parseResponse(paymentData)
              .then(function (response) {
                setEmailShippingPayment(
                  paymentData.email,
                  newShippingAddress,
                  method.code,
                  response.nonce
                ).then(function (response_shipping) {
                    setCartInfo(response_shipping);
                });
              });
          }
          catch (error) {
            setErrorMessage(error);
          }
        }
      })
      .catch(function (err) {
        // Handle errors
        setErrorMessage(err);
      });
  }, [
    braintreeGooglePayClient,
    paymentsClient,
    method,
    grandTotalAmount,
    setErrorMessage,
    setCartInfo,
  ]);

  // If braintree is not selected reset client
  useEffect(() => {
    if (!isSelected && braintreeGooglePayClient) {
      setBraintreeGooglePayClient(null);
    }
  }, [isSelected, braintreeGooglePayClient]);

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
    return { radioInputElement };
  }

  if (!gPayButtonReady) {
    return (
      <>
        <div>{radioInputElement}</div>
        <div className="mx-4 my-4">
          <Card bg="darker">
            <div className="flex items-center justify-center py-4">
              <button
                style={gPayButtonStyle}
                type="button"
                label="google pay button"
              />
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div>{radioInputElement}</div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="flex items-center justify-center py-4">
            <button
              style={gPayButtonStyle}
              type="button"
              onClick={handlePerformGooglePay}
              label="google pay button"
            />
          </div>
        </Card>
      </div>
    </>
  );
}

GooglePay.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default GooglePay;
