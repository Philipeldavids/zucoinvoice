import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import DashBoardLayout from './DashBoardLayout';
import styles from './InvoiceList.module.css';
import { NavLink } from 'react-router-dom';
import axios from '../api/axios';
import Image from '../assets/Frame.png';
import logo from '../assets/zucoinvoiceapplogo.png';
import QRCode from 'qrcode';

function InvoiceList() {
  //const [Tin, setTin] = useState([]);
  const [show, setShow] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientFilter, setClientFilter] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
  //const { invoiceId } = useInvoice();
  //const[invoice, setInvoice] = useState([]);
  //const [formattedValue, setFormattedValue] = useState("");

  const SEARCH_URL = 'api/v1/Invoice/search/';
  const GETINVOICE_URL = 'api/v1/Invoice/GetInvoiceByUser/';
  const DELETE_URL = 'api/v1/Invoice/DeleteInvoice/';
  
  //const DOWNLOAD_URL = 'api/v1/Invoice/DownloadInvoice/';

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      getInvoice(foundUser.id);
     
    }
  }, []);

  // Convert array to CSV
const convertToCSV = (data) => {
  const headers = ["Invoice Number", "Client", "Tin", "Date", "Total", "Tax", "TotalTaxInclusive"];
  const rows = data.map(inv => [
    inv.invoiceNumber,
    inv.client,
    inv.clientTin,
    inv.createdDate,
    inv.subTotal,
    inv.tax,
    inv.totalTaxInclusive
  ]);

  let csvContent = headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });
  return csvContent;
};

const downloadCSV = () => {
  // Start with full invoice list
  let filtered = [...invoices];
  
  // Filter by client name
  if (clientFilter.trim() !== "") {
    filtered = filtered.filter(inv =>
      inv.client.toLowerCase().includes(clientFilter.toLowerCase())
    );
  }

  // Filter by date range
  if (startDate) {
    filtered = filtered.filter(inv => new Date(inv.createdDate) >= new Date(startDate));
  }
  if (endDate) {
    filtered = filtered.filter(inv => new Date(inv.createdDate) <= new Date(endDate));
  }

  if (filtered.length === 0) {
    alert("No invoices match your filters.");
    return;
  }

  const csv = convertToCSV(filtered);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "invoices.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// generate pdf
const generatePDF = useCallback(async (invoiceId) => {

    let invoic = [];
  let subscriptionStatus = false;
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
      };

        
  try {
    const res = await axios.get(`api/v1/Invoice/GetInvoiceById/${invoiceId}`);
    if (res.status !== 200) {
      alert("Error fetching invoice");
      return;
    }

    invoic = res.data;
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

    // Add image (invoice logo if available)

    
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

    // Details
    doc.setFontSize(12);
    doc.text(`Invoice Number: INV${invoic.invoiceNumber}`, 20, 40);
    doc.text(`Contact Name: ${invoic.client}`, 20, 50);
    doc.text(`Created Date: ${invoic.createdDate}`, 20, 60);

    // Table
    const tableData = invoic.items?.map((item) => [
      item.description,
      item.quantity,
      item.unitPrice.toFixed(2),
      (item.quantity * item.unitPrice).toFixed(2),
    ]) || [];

    doc.autoTable({
      startY: 70,
      head: [["Description", "Quantity", "Price(NGN)", "Total(NGN)"]],
      body: tableData,
    });

    // Totals
    const formattedTotal = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(invoic.totalTaxInclusive || 0);

    console.log(formattedTotal);
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Tax: %${invoic.tax}`, 20, finalY); 
  doc.text(`Total(NGN): ${formattedTotal.replace('₦','')}`, 20, finalY + 10, { encoding: "UTF-8" });

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
const qrData = `Invoice: ${invoic.invoiceNumber}
Total: ${invoic.totalTaxInclusive}
Client: ${invoic.client}`;

const qrImage = await QRCode.toDataURL(qrData);

// ✅ Add to PDF
doc.addImage(qrImage, "PNG", 150, finalY + 20, 40, 40);
    // Add logo
    if (!subscriptionStatus) {
        const response = await fetch(logo);
        const blob2 = await response.blob();
        const base64Logo = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob2);
        });
        doc.addImage(base64Logo, "PNG", 80, 200, 50, 50);
        doc.setTextColor(150);
        doc.setFontSize(9);
        doc.text("Generated with ZucoInvoice Free Tier", 70, 260);
    }
   

    // Generate PDF Blob
    const pdfBlob = new Blob([doc.output("arraybuffer")], {
      type: "application/pdf",
    });

    // Optional: auto download
    doc.save(`Invoice_${invoic.invoiceNumber}.pdf`);

    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}, [user]);
 
 


      
    // download pdf

//     const downloadPDF = async (invoiceId) => {
//     const pdfBlob = await generatePDF(invoiceId);
//     const pdfURL = URL.createObjectURL(pdfBlob);
//     const link = document.createElement("a");
//     link.href = pdfURL;
//     link.download = `Invoice_${invoice.invoiceNumber}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };



  
const getInvoice = async (userId) => {
    try {
      const response = await axios.get(GETINVOICE_URL + userId);
      if (response.status === 200) {
        setInvoices(response.data);        
        
      } else {
        alert('Error fetching invoices');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleSearch = async () => {
    if (query.trim() === '') {
      setShow(false);
      return;
    }
    try {
      const response = await axios.get(`${SEARCH_URL}${user?.id}/${query}`);
      if (response.status === 200) {
        setResults(response.data);
        setShow(true);
      } else {
        alert('Error searching invoices');  
      }
    } catch (error) {
      console.log('Search error:', error);
    }
  };

  const handleDelete = async (Id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const response = await axios.delete(`${DELETE_URL}${Id}`);
      if (response.status === 200) {
        alert('Invoice deleted successfully');
        setInvoices(invoices.filter((inv) => inv.invoiceID !== Id));
      } else {
        alert('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

 

  // Pagination logic
  const indexOfLastInvoice = currentPage * entriesToShow;
  const indexOfFirstInvoice = indexOfLastInvoice - entriesToShow;
  const currentInvoices = show
    ? results.slice(indexOfFirstInvoice, indexOfLastInvoice)
    : invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const totalInvoices = show ? results.length : invoices.length;
  const totalPages = Math.ceil(totalInvoices / entriesToShow);

  return (
    <div>
      <DashBoardLayout />
      <div className={styles.invoicelist_container}>
        <div id={styles.invoice_title}>
          <p>Invoices</p>
          <NavLink to="/createinvoice">
            <button type="submit" id={styles.createnewbtn}>
              Create New
            </button>
          </NavLink>
        </div>

        <div id={styles.params}>
          <div id={styles.shownumber}>
            <p>Show</p>
            <input
              type="number"
              id={styles.numberentry}
              min="1"
              value={entriesToShow}
              onChange={(e) => {
                setEntriesToShow(Number(e.target.value));
                setCurrentPage(1);
              }}
            />
            <p>entries</p>
          </div>
          <div id={styles.search}>
            <p>Search</p>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              id="searchentry"
            />
          </div>
        </div>

        <div>
          <div className={styles.filterRow}>
  <div>
    <label>Client Name</label>
    <input
      type="text"
      value={clientFilter}
      onChange={(e) => setClientFilter(e.target.value)}
      placeholder="Filter by client"
    />
  </div>

  <div>
    <label>Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </div>

  <div>
    <label>End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  <button onClick={downloadCSV} className={styles.csvButton}>
    Download CSV
  </button>
</div>

          <ul id={styles.invoicelist}>

            <li>Number</li>
            <li>Client</li>
            <li>Date</li>
            <li>Total</li>
            <li>Action</li>
          </ul>

          {currentInvoices.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: 20 }}>No invoices found</p>
          ) : (
            currentInvoices.map((invoice) => (
              <ul key={invoice.invoiceID} id={styles.invoicelistitem}>
                <li>{invoice.invoiceNumber}</li>
                <li>{invoice.client}</li>
                <li>{invoice.createdDate}</li>
                <li>{invoice.totalTaxInclusive}</li>
                <li className={styles.action}>
                  <img
                    src={Image}
                    alt="delete"
                    id={styles.delete}
                    onClick={() => handleDelete(invoice.invoiceID)}
                  />
                  <button
                    type="button"
                    className={styles.addnewbtn}
                    onClick={() => generatePDF(invoice.invoiceID)}
                  >
                    Download PDF
                  </button>
                </li>
              </ul>
            ))
          )}
        </div>

        <div id={styles.invoicelistnav}>
          <p>
            Showing {indexOfFirstInvoice + 1} to{' '}
            {Math.min(indexOfLastInvoice, totalInvoices)} of {totalInvoices} entries
          </p>
          <div id={styles.invoicenavbtn}>
            <button
              type="button"
              id={styles.prevbtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              id={styles.nextbtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceList;
