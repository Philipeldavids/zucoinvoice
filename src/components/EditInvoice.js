import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import DashBoardLayout from './DashBoardLayout';
import styles from './createinvoice.module.css';
import Image from '../assets/upload.png';
import Image2 from '../assets/Frame.png';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { useInvoice } from "../context/InvoiceContext";
import { Modal, Button, Spinner } from 'react-bootstrap';
 import { useParams } from "react-router-dom";

function EditInvoice() {
  const [tin, setTin] = useState('');
  const [newTin, setNewTin] = useState(''); // modal input
  const [invoiceno, setInvoiceno] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [amount, setAmount] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [tax, setTax] = useState('');
  const [Total, setTotal] = useState('');
  const [footnote, setFootnote] = useState('');
  const [items, setItems] = useState([]);
  const [showItem, setShowItem] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Loading spinner state
  const { setInvoiceId } = useInvoice();
  const [taxdiff, setTaxDiff] = useState('');

  const [show, setShow] = useState(false);
  const [user, setUser] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usage, setUsage] = useState({ used: 0, limit: 5 });

  const ADDCONTACT_URL = "api/v1/Contact/AddContact";
  const GETCONTACTS_URL = "api/v1/Contact/GetContactByUser/";
  //const GETINVNUMBER_URL = "api/v1/Invoice/GetInvoiceNumber";
  //const EDIT_URL = "api/v1/Invoice/Create";
   

const { id } = useParams();

useEffect(() => {
  fetchInvoice();
}, [id]);

const fetchInvoice = async () => {
  try {
    const response = await axios.get(
      `api/v1/Invoice/GetInvoiceById/${id}`
    );

    const data = response.data;

    
    setContact(data.client);
    setInvoiceno(data.invoiceNumber);
    setTin(data.clientTin);
    setTax(data.tax);
    setFootnote(data.footNote);
    setSubTotal(data.subTotal);
    setTotal(data.totalTaxInclusive);
    setItems(data.items || []);
    //console.log(data.items);
    setShowItem(true);
    setPreview(data.imageUrl);

  } catch (err) {
    console.log(err);
  }
};
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  //const LOGO_STORAGE_KEY = "invoice_logo_preview";

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      getContact(foundUser?.id);
      //getInvoiceNumber();
      
    } else{
        navigate("/login");
    }
  }, [navigate]);
   useEffect(() => {
    const checkSubscription = async () => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const token = storedUser?.token;
  
        if (!token) return;
  
        // Get subscription
        const subRes = await axios.get(`api/v1/subscription/current/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const hasSubscription = subRes.data?.hasActiveSubscription;
  
        // Get invoice usage
        // const usageRes = await axios.get(`api/v1/invoice/usage/${storedUser.id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
  
        const used = subRes.data?.invoicesUsed || 0;
        const limit = subRes.data?.freeLimit || 5;
  
        setUsage({ used, limit });
  
        // 🚨 Show modal if limit reached and no subscription
        if (!hasSubscription && used >= limit) {
          setShowLimitModal(true);
        }
  
      } catch (err) {
        console.error("Subscription check failed", err);
      }
    };
  
    checkSubscription();
  }, []);



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        ADDCONTACT_URL,
        {
          customerName: name,
          customerEmail: email,
          customerAddress: address,
          customerPhoneNumber: phonenumber,
          customerTin: newTin,
          userId: user?.id,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        handleClose();
        alert("Contact created successfully");
        getContact(user?.id);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
  const subTota = items.reduce((acc, element) => acc + parseFloat(element.amount || 0), 0);
  setSubTotal(subTota.toFixed(2));

  let taxx = 0;
  let total = 0;
  let taxdiff = 0;

  if (tax !== '' && !isNaN(tax)) {
    taxx = (parseFloat(tax) / 100) * subTota;
    total = subTota + taxx;
    taxdiff = total - subTota;
  } else {
    total = subTota;
  }
  
  setTaxDiff(taxdiff.toFixed(2));
  setTotal(total.toFixed(2));
}, [items, tax]);
   
const getClientTin = (e) => {
  const selectedId = e.target.value;
 
  setContact(selectedId);

  const selectedContact = contacts.find(
    (c) => c.customerName === selectedId
  );
  
  setTin(selectedContact?.customerTin || "");
};

//   const getInvoiceNumber = async () => {
//     try {
//       const response = await axios.get(GETINVNUMBER_URL);
//       if (response.status === 200) {
//         const prefix = "INV";
//         const invNo = response.data + 1;
//         setInvoiceno(prefix + invNo);
//       }
//     } catch (error) {
//       console.log("error:", error);
//     }
//   };

  const getContact = async (userId) => {
    try {
      const response = await axios.get(GETCONTACTS_URL + userId);
      if (response.status === 200) {
        setContacts(response.data);
        console.log(response.data);
        
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const addItem = (e) => {
    e.preventDefault();

    if (description.trim() && quantity !== '' && price !== '' && discount !== '') {
      setItems([
        ...items,
        {
          id: uuidv4(),
          description,
          quantity,
          discount,
          unitPrice: price,
          amount,
        },
      ]);

      setShowItem(true);
      setDescription('');
      setPrice('');
      setAmount('');
      setQuantity('');
      setDiscount('');
    } else {
      alert("Please complete values before adding item");
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter((x) => x.id !== id));
  };

  const handleIconClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setSelectedFile(file);

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Image = reader.result;

  //    const previewUrl = URL.createObjectURL(file);
  // setPreview(previewUrl);
   setPreview(base64Image);

    const key = `invoice_logo_preview_${user?.id}`;
    localStorage.setItem(key, base64Image); // ✅ user-specific
  };

  reader.readAsDataURL(file);
};

  const handleCalc = () => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    const disc = parseFloat(discount) || 0;
    setAmount(qty * prc - disc);
  };

  const handleDiscard = () => {
    // ✅ Reset all invoice fields and states
    setContact('');
    setTin('');
    setDescription('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setAmount('');
    setSubTotal('');
    setTax('');
    setTotal('');
    setFootnote('');
    setItems([]);
    setShowItem(false);
    
    alert("Invoice discarded successfully.");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!contact || items.length === 0) {
      alert("Please select a contact and add at least one item.");
      return;
    }

    setLoading(true); // ✅ Show spinner
    const formData = new FormData();
    if (selectedFile instanceof File) {
  formData.append('image', selectedFile);
} 
    formData.append('invoiceNumber', invoiceno);
    formData.append('contactName', contact);
    formData.append('clientTin', tin);
    formData.append('subTotal', parseFloat(subTotal) || 0);
    formData.append('tax', tax ? parseInt(tax) : 0);
    formData.append('footNote', footnote);
    formData.append('totalPrice', parseFloat(Total) || 0);
    formData.append('items', JSON.stringify(items));
    formData.append('userId', user?.id);
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    try {
      const response = await axios.put(`api/v1/Invoice/UpdateInvoice/${id}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
      if (response.status === 200 || response.status === 201) {
        setInvoiceId(response.data.invoiceID);
        //localStorage.setItem(LOGO_STORAGE_KEY, response.data.imageURl);
        const imageUrl = response.data.imageURl;

        const key = `invoice_logo_preview_${user?.id}`;

        localStorage.setItem(key, imageUrl);   // ✅ small + safe
        setPreview(imageUrl);        
       // setPreview(response.data.imageURl);
        alert('Invoice Update Successful');
        navigate("/invoicelist");
      } else {
        alert('Invoice Update failed');
      }
    } catch (error) {
      console.error('Creation error:', error);
      alert('Error Updating invoice.');
    } finally {
      setLoading(false); // ✅ Hide spinner
    }
  };

  return (
    <>
      <DashBoardLayout />

      {/* ✅ Overlay Spinner */}
      {loading && (
        <div className={styles.overlay}>
          <Spinner animation="border" variant="light" />
          <p>Processing Invoice...</p>
        </div>
      )}

      <div className={styles.createinvoice_container}>
        <form method="post" encType="multipart/form-data">
          <h4>Create Invoice</h4><br />
          <p>Invoice Number</p>
    <input value={invoiceno} type='text' id={styles.invoicenumber} readOnly></input>
    <div className={styles.contactHeader}>
        <p>TO:</p>
        <p onClick={handleShow} className={styles.buttonEdit} style={{ cursor: 'pointer'}}>Add Contact</p>
    </div>
<select
  value={contact}
  onChange={getClientTin}
  className={styles.contact}
>
  <option>select contact</option>

  {contacts.map((c) => (
    <option key={c.contactId}>
      {c.customerName}
    </option>
    
  ))}
</select>

<div>TIN: {tin || ""}</div>
  

    <br/><br/>

    
    <div className={styles.logo}>
    <img src={Image} onClick={handleIconClick} alt='add logo'style={{ zIndex: 1, position: 'relative', width: '40px', marginTop:'-15px', cursor: 'pointer' }} />
    {preview && <img src ={preview} style={{ position: 'absolute', opacity: 0.7, marginLeft: 0, marginTop: 0, width: 200, height:180 }}alt='dropdown' id='dropdown'/>}
    <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      </div>
      <div style={{ marginleft: 30}}>
    <div>
        <ul className={styles.invoiceheading}>
            <li>Item Description</li>
            <li>Quantity</li>
            <li>Unit Price</li>
            
            <li>Discount</li>
            
            <li>Amount</li>
        </ul>
    </div>
      
    {showItem && (items.map((item) =>(
           
           <ul key={item.id} className={styles.input_loading}>
                    <li>{item.description}</li>
                     <li>{item.quantity}</li>
                     <li>{item.unitPrice}</li>
                     <li>{item.discount}</li>
                     <li>{item.amount}</li>
                     <li onClick={()=>handleDelete(item.id)}><img src={Image2} alt='delete' id={styles.delete}/></li>
            </ul>
        )))       
    }
        <ul className={styles.input_loading}>
            <li><input type='text' value={description} onChange={(e)=>setDescription(e.target.value)} id={styles.itemdescription} placeholder='Enter Description'></input></li>
            <li><input type='number' value={quantity} onChange={(e)=>setQuantity(e.target.value)} id={styles.quantity} placeholder='0'></input></li>
            <li><input type='text' value={price} onChange={(e)=>setPrice(e.target.value)} id={styles.unitprice} placeholder='0'></input></li>
            <li><input type='text' value={discount}  onChange={(e)=>setDiscount(e.target.value)} onKeyUp={handleCalc} id={styles.discount} placeholder='0'></input></li>
            <li><input type='text' value={amount} id={styles.amount} placeholder='0'readOnly></input></li>
            <button type='submit' onClick={addItem} className={styles.addnewbtn}>ADD</button>
        </ul>
        </div>
    
    <div id={styles.totaldetail}>
        <span>SubTotal:</span><input type='text' value={subTotal} readOnly></input>
        <div id={styles.taxdetail}>
        <span>Tax(%):</span><input type='number' style={{ borderWidth: 1 }} value={tax} onChange={(e)=> setTax(e.target.value)}></input>
        <div> ₦:<span>{taxdiff}</span> </div>
        </div>
        <span id={styles.total}>TOTAL(₦):</span><input type='text'value={Total} readOnly></input>
        
    </div>
    <div>
        <p>FOOTNOTE</p>
        <textarea value={footnote} onChange={(e) => setFootnote(e.target.value)} id={styles.footnote}></textarea>
    </div>
          <div id={styles.actionbtn}>
            <button type="button" onClick={handleDiscard}>DISCARD</button>
            <button onClick={handleUpdate}>PROCEED</button>
          </div>
        </form>
      </div>
      <Modal show={showLimitModal} backdrop="static"  centered>
        <Modal.Header>
          <Modal.Title>Free Limit Reached</Modal.Title>
        </Modal.Header>
      
        <Modal.Body>
          <p>
            You have used <strong>{usage.used}/{usage.limit}</strong> free invoices.
          </p>
          <p>
            Your free trial has ended. Please subscribe to continue generating invoices.
          </p>
        </Modal.Body>
      
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={() => setShowLimitModal(false)}>
            Maybe Later
          </Button> */}
          <Button variant="primary" onClick={() => navigate("/subscription")}>
            Subscribe Now
          </Button>
        </Modal.Footer>
      </Modal>
             
      <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add A Contact Detail</Modal.Title>
                </Modal.Header>
                <form>
                <Modal.Body>
                    <div>
                        <Modal.Title>Name</Modal.Title><br/> 
                        <input type="text" onChange={(e)=> setName(e.target.value)} placeholder='Name' value={name}></input><br/>
                        <Modal.Title>Email</Modal.Title><br/>
                        <input type="text" onChange={(e)=> setEmail(e.target.value)} placeholder='Email' value={email}></input><br/>
                        <Modal.Title>Address</Modal.Title><br/>
                        <input type="text" onChange={(e)=> setAddress(e.target.value)} placeholder='Address' value={address}></input><br/>
                        <Modal.Title>PhoneNumber</Modal.Title><br/>
                        <input type="text" onChange={(e)=> setPhoneNumber(e.target.value)} placeholder='PhoneNumber' value={phonenumber}></input>
                        <Modal.Title>Tin:</Modal.Title><br/>
                        <input
                              type="text"
                              onChange={(e)=> setNewTin(e.target.value)}
                              placeholder='Tin'
                              value={newTin}
                            />
                    </div>
                
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
    </>
    
     )
}

export default EditInvoice;






