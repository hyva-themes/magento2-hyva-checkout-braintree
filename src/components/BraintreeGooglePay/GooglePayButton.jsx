import React, { useEffect, useState, useCallback } from 'react';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientGooglePay from 'braintree-web/google-payment';
import paymentConfig from './braintreeGooglePayConfig';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import setEmailShippingPayment from '../../api/setEmailShippingPayment';
import { prepareAddress, gPayButtonStyle } from './utility';
import env from '../../../../../utils/env';

function GooglePayButton() {
  const { setErrorMessage } = useBraintreeAppContext();
  const { grandTotalAmount, setCartInfo } = useBraintreeCartContext();
  const [braintreeGooglePayClient, setBraintreeGooglePayClient] =
    useState(null);
  const [gPayLoaded, setGPayLoaded] = useState(false);
  const [gPayButtonReady, setGPayButtonReady] = useState(false);

  let paymentsClient;

  // add the gpay script in
  useEffect(() => {
    if (typeof window.google === 'undefined') {
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
    }
    // eslint-disable-next-line
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
                    setGPayButtonReady(true);
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
  }, [paymentsClient, braintreeGooglePayClient, setErrorMessage]);

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
      .then(function (paymentData) {
        const newShippingAddress = prepareAddress(paymentData.shippingAddress);
        if (paymentData.email && paymentData.shippingAddress) {
          try {
            braintreeGooglePayClient
              .parseResponse(paymentData)
              .then(function (response) {
                setEmailShippingPayment(
                  paymentData.email,
                  newShippingAddress,
                  'braintree_googlepay',
                  response.nonce
                ).then(function (responseShipping) {
                  setCartInfo(responseShipping);
                });
              });
          } catch (error) {
            setErrorMessage(error);
          }
        }
      })
      .catch(function (error) {
        // Handle errors
        setErrorMessage(error);
      });
  }, [
    braintreeGooglePayClient,
    paymentsClient,
    grandTotalAmount,
    setErrorMessage,
    setCartInfo,
  ]);

  if (!gPayButtonReady) {
    return (
      <div className="flex items-center justify-center py-4">
        <button
          style={gPayButtonStyle}
          type="button"
          label="google pay button"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      <button
        style={gPayButtonStyle}
        type="button"
        onClick={handlePerformGooglePay}
        label="google pay button"
      />
    </div>
  );
}

export default GooglePayButton;
