import React, { useEffect, useState } from 'react';
import { func, shape } from 'prop-types';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientPayPal from 'braintree-web/paypal-checkout';
import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreePayPalConfig';
import { SHIPPING_ADDR_FORM } from '../../../../../config';
import useFormikMemorizer from '../../../../../hook/useFormikMemorizer';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import {
  getCreatePaymentOptions,
  payPalButtonStyle,
  prepareAddress,
} from './utility';
import env from '../../../../../utils/env';
import setShippingPayment from '../../api/setShippingPayment';
import setPaymentMethod from '../../api/setPaymentMethod';

function PayPal({ method, selected, actions }) {
  const { setErrorMessage } = useBraintreeAppContext();
  const { grandTotalAmount, setCartInfo } = useBraintreeCartContext();
  const sectionFormikData = useFormikMemorizer(SHIPPING_ADDR_FORM);
  const { formSectionErrors, formSectionValues } = sectionFormikData;
  const [payPalLoaded, setPayPalLoaded] = useState(false);
  const isSelected = method.code === selected.code;
  const createPaymentOptions = getCreatePaymentOptions(
    formSectionErrors,
    formSectionValues,
    grandTotalAmount
  );
  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect(() => {
    async function authoriseBraintree() {
      if (isSelected && paymentConfig.clientToken && !payPalLoaded) {
        await BraintreeClient.create({
          authorization: paymentConfig.clientToken,
        })
          .then(function (clientInstance) {
            return BraintreeClientPayPal.create({
              client: clientInstance,
            });
          })
          .then(function (paypalCheckoutInstance) {
            // Load the PayPal JS SDK (see Load the PayPal JS SDK section)
            paypalCheckoutInstance
              .loadPayPalSDK({
                // need to set this to the currency of the checkout in the future
                currency: env.currencyCode,
                intent: 'capture',
              })
              .then(function (paypalCheckout) {
                // The PayPal script is now loaded on the page and
                // window.paypal.Buttons is now available to use
                // render the PayPal button (see Render the PayPal Button section)
                return window.paypal
                  .Buttons({
                    style: payPalButtonStyle,
                    fundingSource: window.paypal.FUNDING.PAYPAL,
                    createOrder() {
                      return paypalCheckout.createPayment(createPaymentOptions);
                    },
                    onApprove(data) {
                      return paypalCheckout
                        .tokenizePayment(data)
                        .then(function (payload) {
                          // Submit `payload.nonce` to your server
                          const newShippingAddress = prepareAddress(
                            payload.details
                          );
                          if (typeof formSectionErrors !== 'undefined') {
                            setShippingPayment(
                              newShippingAddress,
                              method.code,
                              payload.nonce
                            ).then(function (response) {
                              setCartInfo(response);
                            });
                          } else {
                            setPaymentMethod(method.code, payload.nonce).then(
                              function (response) {
                                setCartInfo(response);
                              }
                            );
                          }
                        });
                    },
                    onError(error) {
                      console.error('PayPal error', error);
                    },
                  })
                  .render('#paypal-button');
              })
              .then(function () {
                // The PayPal button will be rendered in an html element with the ID
                // `paypal-button`. This function will be called when the PayPal button
                // is set up and ready to be used
                setPayPalLoaded(true);
              });
          })
          .catch(function () {
            // Handle component creation error
          });
      }
    }
    authoriseBraintree();
  }, [isSelected, payPalLoaded, setErrorMessage]);

  // If braintree is not selected reset client
  useEffect(() => {
    if (!isSelected && payPalLoaded) {
      setPayPalLoaded(null);
    }
  }, [isSelected, payPalLoaded]);

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

  return (
    <>
      <div>{radioInputElement}</div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="flex items-center justify-center py-1">
            <div id="paypal-button" />
          </div>
        </Card>
      </div>
    </>
  );
}

PayPal.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

PayPal.defaultProps = {
  actions: '',
};

export default PayPal;
