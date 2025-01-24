import React, { useEffect } from 'react'
import axios from '../api/axios'
import { useState, useRef } from 'react'
import DashBoardLayout from './DashBoardLayout'
import './createinvoice.css'
import Image from '../assets/upload.png'
import Image2 from '../assets/Frame.png'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { useInvoice } from "../context/InvoiceContext";
import { Modal, Button } from 'react-bootstrap';
function CreateInvoice() {

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
    const { setInvoiceId } = useInvoice();
    //contact
    const [show, setShow] = useState(false);     
    const [user, setUser] = useState();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');

    const ADDCONTACT_URL = "api/Contact/AddContact";
    const GETCONTACTS_URL = "api/Contact/GetContactByUser/";
    const GETINVNUMBER_URL = "api/v1/Invoice/GetInvoiceNumber";
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

     useEffect(() => {
            const loggedInUser = sessionStorage.getItem("user");
            if (loggedInUser) {
              const foundUser = JSON.parse(loggedInUser);         
              setUser(foundUser); 
              getContact(foundUser?.id);
              getInvoiceNumber();                      
            }
          }, []);
    const handleSubmit = async() => {
            
            try{
                var response = await axios.post(ADDCONTACT_URL, {
    
                    customerName: name,
                    customerEmail: email,
                    customerAddress: address,
                    customerPhoneNumber : phonenumber,
                    userId: user?.id
                },
                   {
                headers: {
                  "Content-Type": "Application/json"
                }   
            });
                if(response.status === 200){
                    handleClose();
                    alert("Contact created successfully");
                    getContact(user?.id);           
                }
    
            }
            catch(error){
                console.log("error:", error)
            }       
        };

    useEffect(() => {
        const subTota = items.reduce((acc, element) => acc + parseFloat(element.amount || 0), 0);
        setSubTotal(subTota);        
        
        var taxx = 0;
        var total = 0;
        if(tax !== '' && !isNaN(tax)){
            taxx += (parseFloat(tax)/100) * parseFloat(subTota);
            total += (parseFloat(subTota) + taxx);
        }
        else{
            total += parseFloat(subTota);
        }
        setTotal(total.toFixed(2));

      }, [items, tax]);

  

          const getInvoiceNumber = async () =>{
            try{
                var response = await axios.get(GETINVNUMBER_URL);
                if(response.status === 200){

                    var prefix = "#INV";
                    var invNo = response.data;
                    invNo++;
                    var invoiceNo = prefix + invNo.toString();
                    setInvoiceno(invoiceNo);
                }
            }
            catch(error){
                console.log("error:", error)
            }
          }
          const getContact = async (userId) => {
            try{
                var response = await axios.get(GETCONTACTS_URL + userId);
    
                if(response.status === 200){
                    setContacts(response.data);
                    
                }
                else{
                    alert("error fetching contacts")
                }
    
            }
            
            catch(error){
                console.log("error:", error);
            }
        };    
    
    const addItem = async (e)=>{
        e.preventDefault();
              
        if(description.trim() && quantity.trim() && price.trim() && discount.trim()){
            
            setItems([...items, { id: uuidv4(), 
                                description: description,
                                quantity : quantity,
                                discount: discount,
                                unitprice: price,                                
                                amount: amount }]);


                                setShowItem(true);                                
                                setDescription('');
                                setPrice('');
                                setAmount('');
                                setQuantity('');
                                setDiscount('');

                               
                                
        }
        else{
            alert("Please complete values before adding item")
        }    
        
            
        }
       //handle delete item

       const handleDelete = (id)=>{
        setItems(items.filter(x=>x.id !== id))
       }
       
   
        const fileInputRef = useRef(null);
        
        const handleIconClick = () => {
            if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatically trigger the file dialog
            }
        };
    
        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                setSelectedFile(file);                
                setPreview(URL.createObjectURL(file)); // Generate preview URL
              }
          };

   
    const handleCalc = (e)=>{
       
        var amount = 0;
        if(discount !== ''){
            
            amount = parseFloat(quantity) * parseFloat(price) - parseFloat(discount);  
        }
        else{
            setDiscount(0);
            amount= parseFloat(quantity) * parseFloat(price);
        }
      
       
        setAmount(amount);
       
    };

    
    const handleDiscard = () =>{

    }


    const CREATE_URL = 'api/v1/Invoice/Create';
    const handleCreate = async(e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('invoiceNumber', invoiceno);
        formData.append('contactName', contact);        
        formData.append('tax', tax);
        formData.append('footNote', footnote);
        formData.append('totalPrice', Total);        
        formData.append('items', JSON.stringify(items));
        formData.append('userId', user?.id);
        
        try{
            const response = await axios.post(CREATE_URL, formData, {
            headers: {
                accept: '*/*',
              "Content-Type": 'multipart/form-data',
            }      
            
          });
            if(response.status === 200){
                setInvoiceId(response.data.invoiceID);
                setPreview(response.data.imageURl);
                navigate("/invoicepage");
                alert('Invoice Creation Successful');
            }
            else{
              alert('Invoice Creation failed');
            }
          }
          catch(error){
            console.error('Creation error:', error);
          }
    };

  return (
    <>
    <DashBoardLayout/>
    <form method="post" enctype="multipart/form-data">
    <div className='createinvoice-container'>
    <h4>Create Invoice</h4><br/>
    <p>Invoice Number</p>
    <input value={invoiceno} type='text' id='invoicenumber' readOnly></input>
    <div className='contactHeader'>
        <p>TO:</p>
        <p onClick={handleShow} className="buttonEdit" style={{ cursor: 'pointer'}}>Add Contact</p>
    </div>
    <select value={contact} onChange={(e)=>setContact(e.target.value)} type='text' id='contact'>
        <option>select contact</option>
        {contacts.map((contact) => (
            <option key={contact.contactId}>{contact.customerName}</option>
        ))}
        
    </select>
    <br/><br/>

    
    <div className='logo'>
    <img src={Image} onClick={handleIconClick} style={{ zIndex: 1, position: 'relative', width: '40px', marginTop:'-15px', cursor: 'pointer' }} />
    {preview && <img src ={preview} style={{ position: 'absolute', opacity: 0.7, marginLeft: -120, marginTop: -78, width: 200, height:180 }}alt='dropdown' id='dropdown'/>}
    <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      </div>
      <div style={{ marginleft: 30}}>
    <div>
        <ul className='invoiceheading'>
            <li>Item Description</li>
            <li>Quantity</li>
            <li>Unit Price</li>
            
            <li>Discount</li>
            
            <li>Amount</li>
        </ul>
    </div>
      
    {showItem && (items.map((item) =>(
           
           <ul key={item.id} className='input-loading'>
                    <li>{item.description}</li>
                     <li>{item.quantity}</li>
                     <li>{item.unitprice}</li>
                     <li>{item.discount}</li>
                     <li>{item.amount}</li>
                     <li onClick={()=>handleDelete(item.id)}><img src={Image2} alt='delete' id='delete'/></li>
            </ul>
        )))       
    }
        <ul className='input-loading'>
            <li><input type='text' value={description} onChange={(e)=>setDescription(e.target.value)} id='itemdescription' placeholder='Enter Description'></input></li>
            <li><input type='number' value={quantity} onChange={(e)=>setQuantity(e.target.value)} id='quantity' placeholder='0'></input></li>
            <li><input type='text' value={price} onChange={(e)=>setPrice(e.target.value)} id='unitprice'placeholder='0'></input></li>
            <li><input type='text' value={discount}  onChange={(e)=>setDiscount(e.target.value)} onKeyUp={handleCalc} id='discount'placeholder='0'></input></li>
            <li><input type='text' value={amount} id='amount'placeholder='0'readOnly></input></li>
            <button type='submit' onClick={addItem} className='addnewbtn'>ADD</button>
        </ul>
        </div>
    
    <div id='totaldetail'>
        <span>SubTotal:</span><input type='text' value={subTotal}></input>
        <div id='taxdetail'>
        <span>Tax(%):</span><input type='number' style={{ borderWidth: 1 }} value={tax} onChange={(e)=> setTax(e.target.value)}></input>
        </div>
        <span id='total'>TOTAL:</span><input type='text'value={Total} ></input>
        
    </div>
    <div>
        <p>FOOTNOTE</p>
        <textarea value={footnote} onChange={(e) => setFootnote(e.target.value)} id='footnote'></textarea>
    </div>
    <div id='actionbtn'>
        <button onClick={handleDiscard}>DISCARD</button>
        <button onClick={handleCreate}>PROCEED</button>
    </div>
    </div>
    </form>

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

export default CreateInvoice