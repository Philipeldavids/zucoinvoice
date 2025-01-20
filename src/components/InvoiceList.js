import React, { useState, useEffect } from 'react'
import DashBoardLayout from './DashBoardLayout'
import './InvoiceList.css'
import {NavLink} from 'react-router-dom'
import axios from '../api/axios'
import Image from '../assets/Frame.png'

function InvoiceList() {
        
     const [show, setShow] = useState(false);
     const [invoices, setInvoices] = useState([]);
     const [query, setQuery] = useState();  
     const [results, setResults] = useState([]);
     const [user, setUser] = useState();
     const SEARCH_URL = "api/v1/Invoice/search/";

     const search = async () => {
        if(query === ""){
            setShow(false);
            return;
        }
        try{
            const response = await axios.get(`${SEARCH_URL}${user?.id}/${query}`);
            if(response.status === 200){
                setResults(response.data);
                setShow(true);
            }
            else{
                alert("error fetching invoices")
            }        
       
        }
        catch(error){
            console.log("error:", error)
        }
        
      };
    

    useEffect(() => {
                const loggedInUser = sessionStorage.getItem("user");
                if (loggedInUser) {
                  const foundUser = JSON.parse(loggedInUser); 
                  setUser(foundUser);
                  getInvoice(foundUser?.id);                        
                }
              }, []);

        const GETINVOICE_URL = "api/v1/Invoice/GetInvoiceByUser/";
              const getInvoice = async (userId)=>{
                try{
                    var response = await axios.get(GETINVOICE_URL + userId)
                    if(response.status === 200){
                        setInvoices(response.data);
                    }
                    else{
                        alert("error fetching invoices")
                    }
                }
                catch(error){
                    console.log("error:", error)
                }
      
              };
  return (
    <div>
        <DashBoardLayout/>
        <div className='invoicelist-container'>
            <div id='invoice-title'> 
                <p>Invoice</p>
                <NavLink to='/createinvoice'><button type='submit' id='createnewbtn'>Create New</button></NavLink>
            </div>
            <div id='params'>
            
                <div id='shownumber'>
                    <p>Show</p>
                    <input type='number' id='numberentry'></input>
                    <p>entries</p>
                </div>
                <div id='search'>
                    <p>Search</p>
                    <input type="text"
                            placeholder="Search..."
                            value={query}
                            onKeyUp={search}                            
                            onChange={(e) => setQuery(e.target.value)}
                            id='searchentry'></input>
                </div>
            </div>
            <div>
                <ul id='invoicelist'>
                    <li>Number</li>
                    <li>Client</li>
                    <li>Date</li>                    
                    <li>Total</li>
                    <li>Action</li>
                </ul>
                {show ? (results.map((invoice)=> (
                    <ul key={invoice.invoiceID} id='invoicelistitem'>
                    <li>{invoice.invoiceNumber}</li>
                    <li>{invoice.client}</li>
                    <li>{invoice.createdDate}</li>                    
                    <li>{invoice.totalPrice}</li>
                    <li><img src={Image} alt='delete' id='delete'/><button type='submit' className='addnewbtn'>Download</button></li>
                </ul>))) : 
                    (invoices.map((invoice)=> (
                        <ul key={invoice.invoiceID} id='invoicelistitem'>
                        <li>{invoice.invoiceNumber}</li>
                        <li>{invoice.client}</li>
                        <li>{invoice.createdDate}</li>                    
                        <li>{invoice.totalPrice}</li>
                        <li style={{ display: "flex", alignItem: "center" }}><img src={Image} alt='delete' id='delete'/><button type='submit' className='addnewbtn'>Download</button></li>
                    </ul>)
                ))}
            </div>
            <div id='invoicelistnav'>
                <p>Showing 0 to 0 of 0 entries</p>
                <div id='invoicenavbtn'>
                    <button type='submit' id='prevbtn'>Previous</button>
                    <button type='submit' id='nextbtn'>Next</button>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default InvoiceList