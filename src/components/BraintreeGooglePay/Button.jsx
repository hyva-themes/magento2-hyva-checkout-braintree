import React, { useEffect, useState, useCallback } from 'react';
import { func, shape } from 'prop-types';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientGooglePay from 'braintree-web/google-payment';
import Card from '../../../../../components/common/Card';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeGooglePayConfig';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import setEmailShippingPayment from '../../api/setEmailShippingPayment';
import { prepareAddress, gPayButtonStyle } from './utility';
import { config } from '../../../../../config';

function Button({ method, selected, actions }) {
  const { setErrorMessage, appDispatch } = useBraintreeAppContext();
  const { grandTotalAmount, setCartInfo } = useBraintreeCartContext();
  const [braintreeGooglePayClient, setBraintreeGooglePayClient] =
    useState(null);
  const [braintreeGooglePayPaymentsClient, setBraintreeGooglePayPaymentsClient] =
    useState(null);
  const [googlePayButtonReady, setGooglePayButtonReady] = useState(false);
  const isSelected = method.code === selected.code;

  useEffect(() => {
    async function authoriseBraintree() {
      if (
        !braintreeGooglePayClient &&
        !braintreeGooglePayPaymentsClient
      ) {
        setBraintreeGooglePayPaymentsClient(new window.google.payments.api.PaymentsClient({
          environment: paymentConfig.environment,
        }));    
        await BraintreeClient.create({
          authorization: paymentConfig.clientToken,
        }).then(function (clientInstance) {
          BraintreeClientGooglePay.create({
            client: clientInstance,
            googlePayVersion: 2,
            googleMerchantId: paymentConfig.merchantId,
          }).then(function (googlePaymentInstance) {
            setBraintreeGooglePayClient(googlePaymentInstance);
            return braintreeGooglePayPaymentsClient.isReadyToPay({
              // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: paymentConfig.cardTypes,
              existingPaymentMethodRequired: true,
            });
          }).then(function (isReadyToPay) {
            if (isReadyToPay.result) {
              // need to put something here to make sure the button is valid
              setGooglePayButtonReady(true);
            }
          })
          .catch(function (error) {
            // Handle creation errors
            setErrorMessage(error);
          });
        });
      }
    }
    authoriseBraintree();
  }, [isSelected, braintreeGooglePayPaymentsClient, braintreeGooglePayClient, setErrorMessage]);

  const handlePerformGooglePay = useCallback(async () => {
    const paymentDataRequest =
      braintreeGooglePayClient.createPaymentDataRequest({
        transactionInfo: {
          currencyCode: config.defaultCurrency,
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
    braintreeGooglePayPaymentsClient
      .loadPaymentData(paymentDataRequest)
      .then(function (paymentData) {
        const newShippingAddress = prepareAddress(paymentData.shippingAddress);
        if (paymentData.email && paymentData.shippingAddress) {
          try {
            braintreeGooglePayClient
              .parseResponse(paymentData)
              .then(function (response) {
                setEmailShippingPayment(
                  appDispatch,
                  paymentData.email,
                  newShippingAddress,
                  method.code,
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
      .catch(function (err) {
        // Handle errors
        setErrorMessage(err);
      });
  }, [
    braintreeGooglePayClient,
    braintreeGooglePayPaymentsClient,
    method,
    grandTotalAmount,
    setErrorMessage,
    setCartInfo,
  ]);

  if (!googlePayButtonReady) {
    return null;
  }

  return (
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
  );
}

Button.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default Button;
