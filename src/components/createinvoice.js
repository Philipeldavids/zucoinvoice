import React, { useEffect } from 'react'
import axios from '../api/axios'
import { useState, useRef } from 'react'
import DashBoardLayout from './DashBoardLayout'
import './createinvoice.css'
import Image from '../assets/dropdown-arrow-svgrepo-com 1.png'
import Image2 from '../assets/Frame.png'

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
    const createdDate = new Date().getUTCDate;
    const [footnote, setFootnote] = useState('');
    const [items, setItems] = useState([]);
    const [showItem, setShowItem] = useState(false);
    const [contacts, setContacts] = useState([]);    
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const GETCONTACTS_URL = "api/Contact/GetContactByUser/";
    const GETINVNUMBER_URL = "api/v1/Invoice/GetInvoiceNumber";

    useEffect(() => {
        const subTota = items.reduce((acc, element) => acc + parseFloat(element.amount || 0), 0);
        setSubTotal(subTota);        
        
        var taxx = 0;
        var total = 0;
        if(tax != '' && !isNaN(tax)){
            taxx += (parseFloat(tax)/100) * parseFloat(subTota);
            total += (parseFloat(subTota) + taxx);
        }
        else{
            total += parseFloat(subTota);
        }
        setTotal(total.toFixed(2));

      }, [items, tax]);

    useEffect(() => {
            const loggedInUser = sessionStorage.getItem("user");
            if (loggedInUser) {
              const foundUser = JSON.parse(loggedInUser);         
              getContact(foundUser?.id);
              getInvoiceNumber();
            }
          }, []);

          const getInvoiceNumber = async () =>{
            try{
                var response = await axios.get(GETINVNUMBER_URL);
                if(response.status === 200){

                    var prefix = "#INV";
                    var invNo = prefix + response.data.toString();
                    setInvoiceno(invNo);
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
    
    const ITEMS_URL = "api/v1/Item/Add";
    const addItem = async (e)=>{
        e.preventDefault();
              
        if(description.trim() && quantity.trim() && price.trim() && discount.trim()){
            
            setItems([...items, { id: items.length + 1, 
                                description: description,
                                quantity : quantity,
                                unitprice: price,
                                discount: discount,
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
        setItems(items.filter(x=>x.id != id))
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
        if(discount != ''){
            
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
    const CREATE_URL = 'api/v1/invoice/create';
    const handleCreate = async() =>{
        try{
            const response = await axios.post(CREATE_URL, {
              invoiceNumber: invoiceno,
              contactId: contact.contactId,
                createdDate: createdDate,
                 

          }, {
            // headers: {
            //   "Content-Type": "Application/json"
            // }
      
            
          });
            if(response.status === 200){
              
                alert('Invoice Creation Successful');
            }
            else{
              alert('Invoice Creation failed');
            }
          }
          catch(error){
            console.error('Creation error:', error);
          }
    }

  return (
    <>
    <DashBoardLayout/>
    <form>
    <div className='createinvoice-container'>
    <h4>Invoice</h4><br/>
    <p>Invoice Number</p>
    <input value={invoiceno} type='text' id='invoicenumber' readOnly></input>
    <div className='contactHeader'>
        <p>TO:</p>
        <p>Add Contact</p>
    </div>
    <select value={contact} onChange={(e)=>setContact(e.target.value)} type='text' id='contact'>
        <option>select contact</option>
        {contacts.map((contact) => (
            <option key={contact.contactId}>{contact.customerName}</option>
        ))}
        
    </select>
    <br/><br/>

    
    <div className='logo'>
    <a onClick={handleIconClick} style={{ zIndex: 1, position: 'relative', cursor: 'pointer' }} >LOGO</a>
    {preview && <img src ={preview} style={{ position: 'absolute', opacity: 0.7, marginLeft: -105, marginTop: -78, width: 180, height:180 }}alt='dropdown' id='dropdown'/>}
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
            <button type='submit' onClick={addItem} id='addnewbtn'>ADD</button>
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
        <textarea value={footnote} onChange={(e)=> setFootnote(e.target.value)}id='footnote'></textarea>
    </div>
    <div id='actionbtn'>
        <button onClick={handleDiscard}>DISCARD</button>
        <button onClick={handleCreate}>PROCEED</button>
    </div>
    </div>
    </form>
    </>
    
  )
}

export default CreateInvoice