import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useInvoice } from "../context/InvoiceContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

function InvoicePage() {

    const { invoiceId } = useInvoice();
    const[invoice, setInvoice] = useState({});
    const [formattedValue, setFormattedValue] = useState(""); // Formatted output

    

      

    useEffect(()=>{
        const fetchInvoice = async () =>{
            var response = await axios.get(`api/v1/Invoice/GetInvoiceById/${invoiceId}`);

            if(response.status === 200){
                console.log(response.data);
                setInvoice(response.data);
            }
        } 
        fetchInvoice();
    }, [invoiceId]);

    const generatePDF = async (invoice) => {
        const doc = new jsPDF();
      
        // Add image
        if (invoice.imageURl) {
          const response = await fetch(invoice.imageURl);
          const blob = await response.blob();
      
          const base64data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
      
          doc.addImage(base64data, "PNG", 150, 10, 50, 50); // (data, format, x, y, width, height)
        }
      
        // Add title
        doc.setFontSize(18);
        doc.text("Invoice", 105, 20, { align: "center" });
      
        // Add invoice details
        doc.setFontSize(12);
        doc.text(`Invoice Number: #INV${invoice.invoiceNumber}`, 20, 40);
        doc.text(`Contact Name: ${invoice.client}`, 20, 50);
        doc.text(`Created Date: ${invoice.createdDate}`, 20, 60);
      
        // Add table for items
        const tableData = invoice.items.map((item) => [
          item.description,
          item.quantity,
          `${item.unitPrice.toFixed(2)}`,
          `${(item.quantity * item.unitPrice).toFixed(2)}`,
        ]);
      
        doc.autoTable({
          startY: 70,
          head: [["Description", "Quantity", "Price(NGN)", "Total(NGN)"]],
          body: tableData,
        });
      
        // Add total and tax
        if (!isNaN(invoice.totalPrice)) {
            // Format as currency
            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
            }).format(invoice.totalPrice);
    
            setFormattedValue(formatted);
          } else {
            setFormattedValue("");
          }
        
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Tax: %${invoice.tax}`, 20, finalY);
        doc.text(`Total(NGN): ${formattedValue}`, 20, finalY + 10);
      
        // Add footer
        doc.setFontSize(10);
        doc.text(invoice.footNote || "Thank you for your business!", 20, finalY + 30);
      
//         const pdfBlob = doc.output("blob");
// console.log(pdfBlob); // Check if it's a valid Blob object
// console.log(pdfBlob instanceof Blob); // Should log `true`

        // Return the PDF as a blob
        const pdfData = doc.output("arraybuffer"); // Get PDF data as an ArrayBuffer
        const pdfBlob = new Blob([pdfData], { type: "application/pdf" });

        return pdfBlob;
      };
      
      // View PDF in a new tab
      const viewPDF = async () => {
        const pdfBlob = await generatePDF(invoice);
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, "_blank");
      };
  // Download PDF
  const downloadPDF = async () => {
    const pdfBlob = await generatePDF(invoice);
    const pdfURL = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = `Invoice_${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <h1>Invoice</h1>
      <button onClick={viewPDF}>View Invoice</button>
      <button onClick={downloadPDF}>Download Invoice</button>
    </div>
  );
};



export default InvoicePage