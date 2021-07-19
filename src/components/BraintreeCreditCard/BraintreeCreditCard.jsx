import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';

import CCForm from './CCForm';
import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import getBraintreeBaseConfig, { getBillingAddress, iFrameStyling, headerStyle } from '../../utility/braintreeConfig';
import BraintreeClient from 'braintree-web/client';
import HostedFields from 'braintree-web/hosted-fields';
import useCardFormValid from './hooks/useCardFormValid';
function BraintreeCreditCard({ method, selected, actions }) {
  const { clientToken } = getBraintreeBaseConfig();
  const { cardFormValid, setCardFormValid } = useCardFormValid();
  const [braintreeClient, setBraintreeClient] = useState(null);
  const [braintreeHostedFields, setBraintreeHostedFields] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [useHeaderStyle, setUseHeaderStyle] = useState('');

  const isSelected = method.code === selected.code;

  // Initialise the iframe using the provided clientToken create a braintreeClient
  // Showing the card form within the payment method.
  useEffect(() => {
    if ((isSelected) && (clientToken) && (braintreeClient)) {
      await BraintreeClient.create({ authorization: braintreeClientToken }, (err, clientInstance) => {
        if (err) {
          console.log(err);
        } 
        else {
          setBraintreeClient(clientInstance);
          HostedFields.create({
              client: clientInstance,
              styles: {iFrameStyling},
              fields: {
                number: { selector: '#card-number', placeholder: '4111 1111 1111 1111' },
                cvv: {selector: '#cvv', placeholder: '123' },
                expirationDate: { selector: '#expiration-date', placeholder: '10/2021' }
              },
            }, (err, hostedFields) => {
              if (err) {
                  console.log(err);
                  return;
              }
              setBraintreeHostedFields(hostedFields);
              hostedFields.on('validityChange', function (event) {
                setCardFormValid(Object.keys(event.fields).every(function (key) {
                  return event.fields[key].isValid;
                }));   
              });
              hostedFields.on('empty', function (event) {
                if (event.emittedBy === 'number') {
                  setUseHeaderStyle('');
                  setCardType('');
                }
              });
              hostedFields.on('cardTypeChange', function (event) {
                  if (event.cards.length === 1) {
                      setCardType(event.cards[0].type.replace('-', ''));
                      setUseHeaderStyle(headerStyle);
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
  }, [isSelected, braintreeCLient]);

  useEffect(() => {
    if ((cardFormValid) && (!paymentNonce)) {
      const options = getBillingAddress();
      braintreeHostedFields.tokenize(options, (err, payload) => {
        if (err) {
            console.log(err);
        } else {
            setPaymentNonce(payload.nonce); 
            setFieldValue(`${PAYMENT_METHOD_FORM}.paymentNonce`, payload.nonce);
        }
      });
    }
  });

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
          <TextInput
            type="hidden"
            value={paymentNonce}
            name="paymentNonce"
            formikData={formikData}
          />
          <div style={useHeaderStyle}>    
            <h1 className="font-thin text-xl block">Payment Method</h1>
          </div>
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