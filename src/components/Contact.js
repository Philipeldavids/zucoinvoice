import React from 'react'
import './Contact.css'
import DashBoardLayout from './DashBoardLayout'

function Contact() {
    return (
        <div>
            <DashBoardLayout/>
            <div className='invoicelist-container'>
                <div id='invoice-header'> 
                <p>Contact</p>
                <button type='submit' id='createnewbtn'>Create New</button>
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
                        <li>Name</li>
                        <li>Email</li>
                       
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

export default Contact