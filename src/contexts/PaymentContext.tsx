import { createContext, useContext, useState } from 'react';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

type PaymentContextType = {
  status: PaymentStatus;
  startPayment: () => void;
  markSuccess: () => void;
};

const PaymentContext = createContext<PaymentContextType>(null as any);

export const usePayment = () => useContext(PaymentContext);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PaymentStatus>('idle');

  const startPayment = () => setStatus('processing');
  const markSuccess = () => setStatus('success');

  return (
    <PaymentContext.Provider value={{ status, startPayment, markSuccess }}>
      {children}
    </PaymentContext.Provider>
  );
}
