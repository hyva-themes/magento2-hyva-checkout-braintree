import { useState } from 'react';

export default function useCardFormValid() {
  const [cardFormValid, setCardFormValid] = useState(false);

  return { cardFormValid, setCardFormValid };
}