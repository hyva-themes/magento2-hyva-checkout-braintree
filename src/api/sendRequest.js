import { config } from '@hyva/payments/config';
import LocalStorage from '@hyva/payments/utils/localStorage';

export default function sendRequest(queryParams = {}) {
  const token = LocalStorage.getCustomerToken();
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  // customer is guest
  return fetch(`${config.baseUrl}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...queryParams }),
  })
    .then(response => response.json())
    .catch(exception => {
      console.error(exception);
      throw exception;
    });
}
