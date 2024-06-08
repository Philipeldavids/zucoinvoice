import React from 'react'
import DashBoardLayout from './DashBoardLayout'
import './createinvoice.css'
import Image from '../assets/dropdown-arrow-svgrepo-com 1.png'
import Image2 from '../assets/Frame.png'

function createinvoice() {
  return (
    <div>
    <DashBoardLayout/>
    <div className='createinvoice-container'>Invoice
    <p>Invoice Number</p>
    <input type='text' id='invoicenumber'></input>
    <div className='contactHeader'>
        <p>TO:</p>
        <p>Add Contact</p>
    </div>
    <input type='text' id='contact'></input>
    <img src ={Image} alt='dropdown' id='dropdown'/>
    <p>Purchase Order Number</p>
    <input type='text' id='contact'></input>
    <div className='logo'>LOGO</div>
    <div>
        <ul className='invoiceheading'>
            <li>Item Description</li>
            <li>Quantity</li>
            <li>Unit Price</li>
            
            <li>Discount(%)</li>
            
            <li>Amount</li>
        </ul>
    </div>
    <div>
        <ul className='input-heading'>
            <li><input type='text' id='itemdescription' placeholder='Enter Description'></input></li>
            <li><input type='text' id='quantity' placeholder='0'></input></li>
            <li><input type='text' id='unitprice'placeholder='0'></input></li>
            <li><input type='text' id='discount'placeholder='0'></input></li>
            <li><input type='text' id='amount'placeholder='0'></input></li>
            <li><img src={Image2} alt='delete' id='delete'/></li>
        </ul>
        <div>
        <button type='submit' id='addnewbtn'>ADD NEW</button>
        </div>
    </div>
    <div id='totaldetail'>
        <p>SubTotal:</p>
        <div id='taxdetail'>
        <p>Tax(%):</p>
        <input type='text' id='tax' placeholder='0'></input>
        </div>
        <p id='total'>TOTAL:</p>
        
    </div>
    <div>
        <p>FOOTNOTE</p>
        <textarea id='footnote'></textarea>
    </div>
    <div id='actionbtn'>
        <button>DISCARD</button>
        <button>PROCEED</button>
    </div>
    </div>
    
    </div>
    
  )
}

export default createinvoice