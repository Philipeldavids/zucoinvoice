import React, { useState, useEffect, useCallback} from 'react';
import axios from '../api/axios';
import { useInvoice } from "../context/InvoiceContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './InvoicePage.css';
import DashBoardLayout from './DashBoardLayout';
import logo from '../assets/zucoinvoiceapplogo.png';

function InvoicePage() {

    const { invoiceId } = useInvoice();
    const[invoice, setInvoice] = useState([]);
    const [formattedValue, setFormattedValue] = useState(""); // Formatted output

    useEffect(()=>{
      const fetchInvoice = async () =>{
          var response = await axios.get(`api/v1/Invoice/GetInvoiceById/${invoiceId}`);

          if(response.status === 200){              
              setInvoice(response.data);              
              const generate = async () => {
                await generatePDF(response.data);
            };
            generate();   
          }
      };
      fetchInvoice();      

  }, [invoiceId]);
    

    const generatePDF = useCallback( async(invoic) => {
        const doc = new jsPDF();
      
        // Add image
        if (invoic.imageURl) {
          const response = await fetch(invoic.imageURl);
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
        doc.text(`Invoice Number: #INV${invoic.invoiceNumber}`, 20, 40);
        doc.text(`Contact Name: ${invoic.client}`, 20, 50);
        doc.text(`Created Date: ${invoic.createdDate}`, 20, 60);
      
        // Add table for items
        const tableData = invoic.items.map((item) => [
          item.description,
          item.quantity,
          `${item.unitPrice.toFixed(2)}`,
          `${(item.quantity * item.unitPrice).toFixed(2)}`,
        ]);
      
        doc.autoTable({
          startY: 70,
          head: [["Description", "Quantity", "Price", "Total"]],
          body: tableData,
        });
      
        // Add total and tax
        if (!isNaN(invoic.totalPrice)) {
            // Format as currency
            const formatted = new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
            }).format(invoic.totalPrice);
    
            setFormattedValue(formatted);
          } else {
            setFormattedValue("");
          }
        
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Tax: %${invoice.tax}`, 20, finalY);
        doc.text(`Total: ${formattedValue}`, 20, finalY + 10);
      
        // Add footer
        doc.setFontSize(10);
        doc.text(invoic.footNote || "Thank you for your business!", 20, finalY + 30);
      
        //add logo
        //const logoPath = "C:/Users/USER/zucoinvoice/zucoinvoice/src/assets/zucoinvoiceapplogo.png"; // Adjust the path as needed
        
  // Fetch the image
        const response = await fetch(logo);
        const blob2 = await response.blob();
        const base64data2 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob2);
        });
        doc.addImage(base64data2, "PNG", 80, 200, 50, 50);

        // Return the PDF as a blob
        const pdfData = doc.output("arraybuffer"); // Get PDF data as an ArrayBuffer
        const pdfBlob = new Blob([pdfData], { type: "application/pdf" });

        return pdfBlob;
      }, [formattedValue]);

   
      
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
        <DashBoardLayout/>
    <div className="invoice-container">
      <h1>Invoice</h1>
      <div style={{ display: "flex", width: "400px", justifyContent: "space-between", marginTop: "30px" }}>
      <button onClick={viewPDF}>View Invoice</button>
      <button onClick={downloadPDF}>Download Invoice</button>
      </div>
      </div>
    </div>
  );
};



export default InvoicePage