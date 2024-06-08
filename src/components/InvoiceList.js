import React from 'react'
import DashBoardLayout from './DashBoardLayout'
import './InvoiceList.css'
import {NavLink} from 'react-router-dom'

function InvoiceList() {
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
                    <input type='text' id='searchentry'></input>
                </div>
            </div>
            <div>
                <ul id='invoicelist'>
                    <li>Number</li>
                    <li>Client</li>
                    <li>Date</li>
                    <li>Status</li>
                    <li>Total</li>
                </ul>
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