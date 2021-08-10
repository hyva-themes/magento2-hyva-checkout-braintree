import React, { useEffect, useState, useCallback } from 'react';

import Card from '@hyva/payments/components/common/Card';
import paymentConfig from './braintreeGooglePayConfig';
import BraintreeClient from 'braintree-web/client';
import BraintreeClientGooglePay from 'braintree-web/google-payment';
import useBraintreeAppContext from '../../hooks/useBraintreeAppContext';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';
import setEmailShipping from '../../api/setEmailShipping';
import { prepareAddress } from './utility';

function GooglePayButton() {
  const { setErrorMessage } = useBraintreeAppContext();
  const { grandTotalAmount, setCartInfo } = useBraintreeCartContext();
  const [braintreeGooglePayClient, setBraintreeGooglePayClient] = useState(null);
  const [gPayLoaded, setGPayLoaded] = useState(false);
  const [gPayButtonReady, setgPayButtonReady] = useState(false);

  let paymentsClient;

  // add the gpay script in
  useEffect(() => {
    if (typeof window.google === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://pay.google.com/gp/p/js/pay.js";
        script.async = true;
        script.onload = () => { setGPayLoaded(true); };
        document.body.appendChild(script);
        return () => {
        document.body.removeChild(script);
        }
    }
  }, []);

  if (gPayLoaded) {
    paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: paymentConfig.environment
    });
  }        
  
  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect( () => {
    async function authoriseBraintree() {
      if ((paymentConfig.clientToken) && (!braintreeGooglePayClient) && (paymentsClient)) {
        await BraintreeClient.create({ authorization: paymentConfig.clientToken }, (err, clientInstance) => {
          if (err) {
            console.log(err);
            setErrorMessage(err);
            return;
          } 
          else {
            BraintreeClientGooglePay.create({
                client: clientInstance,
                googlePayVersion: 2,
                googleMerchantId: paymentConfig.merchantId
            }).then(function (googlePaymentInstance) {
                setBraintreeGooglePayClient(googlePaymentInstance);
                return paymentsClient.isReadyToPay({
                  // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
                  apiVersion: 2,
                  apiVersionMinor: 0,
                  allowedPaymentMethods: paymentConfig.cardTypes,
                  existingPaymentMethodRequired: true
                });
            }).then(function (isReadyToPay) {
              if (isReadyToPay.result) {
                // need to put something here to make sure the button is valid
                setgPayButtonReady(true);
              }
            }).catch(function (err) {
              // Handle creation errors
              setErrorMessage(err);
              console.log(err);
            });
          }
        });
      }
    }                          
    authoriseBraintree();
  }, [paymentsClient, braintreeGooglePayClient, setErrorMessage]);

  const handlePerformGooglePay = useCallback(async () => {
    var paymentDataRequest = braintreeGooglePayClient.createPaymentDataRequest({
      transactionInfo: {
        currencyCode: 'AUD',
        totalPriceStatus: 'ESTIMATED',
        totalPrice: String(grandTotalAmount) // Your amount
      },
      emailRequired: true,
      shippingAddressRequired: true,
      shippingAddressParameters: { phoneNumberRequired: true }
    });
    var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
    cardPaymentMethod.parameters.billingAddressRequired = true;
    cardPaymentMethod.parameters.billingAddressParameters = {
      format: 'FULL',
      phoneNumberRequired: true
    };
    paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
      let newShippingAddress = prepareAddress(paymentData.shippingAddress);
      if (paymentData.email && paymentData.shippingAddress) {
        try {
          braintreeGooglePayClient.parseResponse(paymentData).then(function(response) {
          setEmailShipping(paymentData.email, newShippingAddress,'braintree_googlepay', response.nonce)
            .then(function(response) {
                setCartInfo(response);
            });
          });
        }
        catch (error) {
          setErrorMessage(error);
        }
      }
    }).catch(function (err) {
      // Handle errors
      console.log(err);
      setErrorMessage(err);
    });
  },[braintreeGooglePayClient, paymentsClient, grandTotalAmount, setErrorMessage, setCartInfo]);

  /* Indicates how Google Pay button will appear */
  const buttonStyle = {
    minWidth: "200px",
    minHeight: "40px",
    padding: "11px 24px",
    margin: "10px",
    backgroundColor: "#000",
    backgroundImage: "url(data:image/svg+xml,%3Csvg%20width%3D%22103%22%20height%3D%2217%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M.148%202.976h3.766c.532%200%201.024.117%201.477.35.453.233.814.555%201.085.966.27.41.406.863.406%201.358%200%20.495-.124.924-.371%201.288s-.572.64-.973.826v.084c.504.177.912.471%201.225.882.313.41.469.891.469%201.442a2.6%202.6%200%200%201-.427%201.47c-.285.43-.667.763-1.148%201.001A3.5%203.5%200%200%201%204.082%2013H.148V2.976zm3.696%204.2c.448%200%20.81-.14%201.085-.42.275-.28.413-.602.413-.966s-.133-.684-.399-.959c-.266-.275-.614-.413-1.043-.413H1.716v2.758h2.128zm.238%204.368c.476%200%20.856-.15%201.141-.448.285-.299.427-.644.427-1.036%200-.401-.147-.749-.441-1.043-.294-.294-.688-.441-1.183-.441h-2.31v2.968h2.366zm5.379.903c-.453-.518-.679-1.239-.679-2.163V5.86h1.54v4.214c0%20.579.138%201.013.413%201.302.275.29.637.434%201.085.434.364%200%20.686-.096.966-.287.28-.191.495-.446.644-.763a2.37%202.37%200%200%200%20.224-1.022V5.86h1.54V13h-1.456v-.924h-.084c-.196.336-.5.611-.91.826-.41.215-.845.322-1.302.322-.868%200-1.528-.259-1.981-.777zm9.859.161L16.352%205.86h1.722l2.016%204.858h.056l1.96-4.858H23.8l-4.41%2010.164h-1.624l1.554-3.416zm8.266-6.748h1.666l1.442%205.11h.056l1.61-5.11h1.582l1.596%205.11h.056l1.442-5.11h1.638L36.392%2013h-1.624L33.13%207.876h-.042L31.464%2013h-1.596l-2.282-7.14zm12.379-1.337a1%201%200%200%201-.301-.735%201%201%200%200%201%20.301-.735%201%201%200%200%201%20.735-.301%201%201%200%200%201%20.735.301%201%201%200%200%201%20.301.735%201%201%200%200%201-.301.735%201%201%200%200%201-.735.301%201%201%200%200%201-.735-.301zM39.93%205.86h1.54V13h-1.54V5.86zm5.568%207.098a1.967%201.967%200%200%201-.686-.406c-.401-.401-.602-.947-.602-1.638V7.218h-1.246V5.86h1.246V3.844h1.54V5.86h1.736v1.358H45.75v3.36c0%20.383.075.653.224.812.14.187.383.28.728.28.159%200%20.299-.021.42-.063.121-.042.252-.11.392-.203v1.498c-.308.14-.681.21-1.12.21-.317%200-.616-.051-.896-.154zm3.678-9.982h1.54v2.73l-.07%201.092h.07c.205-.336.511-.614.917-.833.406-.22.842-.329%201.309-.329.868%200%201.53.254%201.988.763.457.509.686%201.202.686%202.079V13h-1.54V8.688c0-.541-.142-.947-.427-1.218-.285-.27-.656-.406-1.113-.406-.345%200-.656.098-.931.294a2.042%202.042%200%200%200-.651.777%202.297%202.297%200%200%200-.238%201.029V13h-1.54V2.976zm32.35-.341v4.083h2.518c.6%200%201.096-.202%201.488-.605.403-.402.605-.882.605-1.437%200-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0%205.52v4.736h-1.504V1.198h3.99c1.013%200%201.873.337%202.582%201.012.72.675%201.08%201.497%201.08%202.466%200%20.991-.36%201.819-1.08%202.482-.697.665-1.559.996-2.583.996h-2.485v.001zm7.668%202.287c0%20.392.166.718.499.98.332.26.722.391%201.168.391.633%200%201.196-.234%201.692-.701.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61%200-1.12.148-1.528.442-.409.294-.613.657-.613%201.093m1.946-5.815c1.112%200%201.989.297%202.633.89.642.594.964%201.408.964%202.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45%201.372-2.486%201.372-.882%200-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96%200-.828.313-1.486.94-1.976s1.463-.735%202.51-.735c.892%200%201.629.163%202.206.49v-.344c0-.522-.207-.966-.621-1.33a2.132%202.132%200%200%200-1.455-.547c-.84%200-1.504.353-1.995%201.062l-1.324-.834c.73-1.045%201.81-1.568%203.238-1.568m11.853.262l-5.02%2011.53H96.42l1.864-4.034-3.302-7.496h1.635l2.387%205.749h.032l2.322-5.75z%22%20fill%3D%22%23FFF%22%2F%3E%3Cpath%20d%3D%22M75.448%207.134c0-.473-.04-.93-.116-1.366h-6.344v2.588h3.634a3.11%203.11%200%200%201-1.344%202.042v1.68h2.169c1.27-1.17%202.001-2.9%202.001-4.944%22%20fill%3D%22%234285F4%22%2F%3E%3Cpath%20d%3D%22M68.988%2013.7c1.816%200%203.344-.595%204.459-1.621l-2.169-1.681c-.603.406-1.38.643-2.29.643-1.754%200-3.244-1.182-3.776-2.774h-2.234v1.731a6.728%206.728%200%200%200%206.01%203.703%22%20fill%3D%22%2334A853%22%2F%3E%3Cpath%20d%3D%22M65.212%208.267a4.034%204.034%200%200%201%200-2.572V3.964h-2.234a6.678%206.678%200%200%200-.717%203.017c0%201.085.26%202.11.717%203.017l2.234-1.731z%22%20fill%3D%22%23FABB05%22%2F%3E%3Cpath%20d%3D%22M68.988%202.921c.992%200%201.88.34%202.58%201.008v.001l1.92-1.918c-1.165-1.084-2.685-1.75-4.5-1.75a6.728%206.728%200%200%200-6.01%203.702l2.234%201.731c.532-1.592%202.022-2.774%203.776-2.774%22%20fill%3D%22%23E94235%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)",
    backgroundOrigin: "content-box",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    borderRadius: "4px",
    boxShadow: "0 1px 1px 0 rgba(60, 64, 67, 0.30), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
    outline: "0",
    cursor: "pointer",
  };

  if (!gPayButtonReady) {
    return (
      <>
        <div className="flex items-center justify-center py-4">
            <button style={buttonStyle} type="button"/>                    
        </div>
      </>
    );  
  }

  return (
    <>
        <div className="flex items-center justify-center py-4">
            <button style={buttonStyle} type="button" onClick={handlePerformGooglePay}/>                    
        </div>
    </>
  );
}

export default GooglePayButton;