import React,{createContext, useContext, useState} from 'react'

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoiceId, setInvoiceId] = useState(null);
  return (
    <InvoiceContext.Provider value={{ invoiceId, setInvoiceId }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => useContext(InvoiceContext);