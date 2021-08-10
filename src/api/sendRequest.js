import _get from 'lodash.get';
import {
  responseDataEmpty,
  responseContainErrors,
  GraphQLResponseException,
} from '@hyva/payments/api/utility';
import env from '@hyva/payments/utils/env';
import { config } from '@hyva/payments/config';
import RootElement from '@hyva/payments/utils/rootElement';
import LocalStorage from '@hyva/payments/utils/localStorage';

export const RESPONSE_TEXT = 'text';
export const RESPONSE_JSON = 'json';

const storeCode = env.storeCode || RootElement.getStoreCode();

export default function sendRequest(
  queryParams = {},
  relativeUrl,
  responseType = 'json',
  additionalHeaders = {}
) {
  const headers = {
    'Content-Type': 'application/json',
    Store: storeCode,
    ...additionalHeaders,
  };
  const token = LocalStorage.getCustomerToken();
  const url = `${config.baseUrl}${relativeUrl || '/graphql'}`;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify({ ...queryParams }),
  }).then(response => {
    if (response.ok && responseType === RESPONSE_TEXT) {
      return response.text();
    }
    return response.json();
  }).then(response => {
    if (!responseContainErrors(response) || !responseDataEmpty(response)) {
      return response;
    }

    const errors = _get(response, 'errors', []);
    const exception = new GraphQLResponseException(errors);

    throw exception;

  }).catch(exception => {
      console.error(exception);
      throw exception;
  });
}
