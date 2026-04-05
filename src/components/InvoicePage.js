import React, { useState, useEffect, useCallback} from 'react';
import axios from '../api/axios';
import { useInvoice } from "../context/InvoiceContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from './InvoicePage.module.css';
import DashBoardLayout from './DashBoardLayout';
import logo from '../assets/zucoinvoiceapplogo.png';
import { useNavigate } from 'react-router-dom';

function InvoicePage() {

    const { invoiceId } = useInvoice();
    const[invoice, setInvoice] = useState([]);
      const [user, setUser] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        const loggedInUser = sessionStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          setUser(foundUser);          
        }
        else{
            navigate("/login");
        }
      }, [navigate]);
    
const generatePDF = useCallback(async () => {
  let invoic = [];
  let subscriptionStatus = false; // default false

  // Fetch invoice
  const respons = await axios.get(`api/v1/Invoice/GetInvoiceById/${invoiceId}`);
  if (respons.status === 200) {
    setInvoice(respons.data);
    invoic = respons.data;
  }

  // Fetch subscription status (to know if user is subscribed)
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;
         
               if (!token) return;
     if (user?.id) {
              const subRes = await axios.get(`api/v1/subscription/current/${user?.id}`, {
                     headers: { Authorization: `Bearer ${token}` }
                   });
      subscriptionStatus = subRes.data?.hasActiveSubscription || false;
    }
  } catch (err) {
    console.warn("Could not fetch subscription status, assuming free tier.");
  }


 // Fetch company settings
let company = null;
try {
 const token = user?.token; // or localStorage
 
       const companyRes = await axios.get("api/v1/settings/getcompany", {
         headers: {
           Authorization: `Bearer ${token}`,
         },
        });
  company = companyRes.data;
} catch (err) {
  console.warn("Could not load company settings");
}
  const doc = new jsPDF();
console.log(company);
  // Add image
  try {
  if (company.logoUrl) {
    const response = await fetch(company.logoUrl);
    const blob = await response.blob();
    const base64data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    doc.addImage(base64data, "PNG", 150, 10, 50, 50);
  }
} catch (err) {
  console.warn("Logo could not be loaded");
}

  // Title
  doc.setFontSize(18);
  doc.text("Invoice", 105, 20, { align: "center" });

  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice Number: #INV${invoic.invoiceNumber}`, 20, 40);
  doc.text(`Contact Name: ${invoic.client}`, 20, 50);
  doc.text(`Created Date: ${invoic.createdDate}`, 20, 60);

  // Table
  const tableData = invoic.items.map((item) => [
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

  // Total and tax
  let formatted = "";
  if (!isNaN(invoic.totalTaxInclusive)) {
    formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(invoic.totalTaxInclusive);
    console.log(formatted);
  } else {
    formatted = "";
  }
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Tax: %${invoic.tax}`, 20, finalY); 
  doc.text(`Total(NGN): ${formatted.replace('₦','')}`, 20, finalY + 10);
  
  // Company Info (Below Table)
if (company) {
  doc.setFontSize(10);
  doc.setTextColor(60);

  doc.text("Business Details", 20, finalY + 50);
  doc.text(`Company: ${company.companyName || ""}`, 20, finalY + 58);
  doc.text(`Address: ${company.address || ""}`, 20, finalY + 66);
  doc.text(`Phone: ${company.phoneNumber || ""}`, 20, finalY + 74);
  doc.text(`Email: ${company.email || ""}`, 20, finalY + 82);
  doc.text(`Website: ${company.website || ""}`, 20, finalY + 90);
}
  
  // Footer
  doc.setFontSize(10);
  doc.text(invoic.footNote || "Thank you for your business!", 20, finalY + 30);

  // ✅ Only add watermark/logo if user is on FREE tier
  if (!subscriptionStatus) {
    const response = await fetch(logo);
    const blob2 = await response.blob();
    const base64data2 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob2);
    });

    // Watermark / logo at bottom
    doc.addImage(base64data2, "PNG", 80, 200, 50, 50);
    doc.setTextColor(150);
    doc.setFontSize(9);
    doc.text("Generated with ZucoInvoice Free Tier", 70, 260);
  }

  // Return PDF blob
  const pdfData = doc.output("arraybuffer");
  const pdfBlob = new Blob([pdfData], { type: "application/pdf" });

  return pdfBlob;
}, [invoiceId, user]);

      useEffect(()=>{
        generatePDF();
  
    }, [generatePDF]);
      
    // Send Invoice via email
const sendInvoice = async () => {
  try {
    const pdfBlob = await generatePDF();
    
     // adjust this if your invoice object uses a different field
    const respons = await axios.get(`api/v1/Contact/GetContactEmailAdd/${invoice.client}`);
    
    const customerEmail = respons.data;
    const formData = new FormData();
    formData.append("file", pdfBlob, `Invoice_${invoice.invoiceNumber}.pdf`);
    formData.append("invoiceId", invoiceId);
    formData.append("email", customerEmail);
    formData.append("businessName", user?.company);

    const response = await axios.post("api/v1/Invoice/SendInvoice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      alert("Invoice sent successfully!");
    } else {
      alert("Failed to send invoice.");
    }
  } catch (error) {
    console.error("Error sending invoice:", error);
    alert("An error occurred while sending the invoice.");
  }
};

      // View PDF in a new tab
      const viewPDF = async () => {
        const pdfBlob = await generatePDF();
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, "_blank");
      };
  // Download PDF
  const downloadPDF = async () => {
    const pdfBlob = await generatePDF();
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
    <div className={styles.invoice_container}>
      <h1>Invoice</h1>
      <div style={{ display: "flex", width: "400px", justifyContent: "space-between", marginTop: "30px" }}>
      <button onClick={viewPDF}>View Invoice</button>
      <button onClick={downloadPDF}>Download Invoice</button>
      <button onClick={sendInvoice}>Send Invoice</button>

      </div>
      </div>
    </div>
  );
};



export default InvoicePage