import React, {useState} from 'react'
import Image from '../assets/zuco invoice app logo 1.png'
import Image2 from '../assets/business 1.png'
import Image3 from '../assets/invoice 1.png'
import Image4 from '../assets/Vector.png'
import { NavLink } from 'react-router-dom'
import './DashBoardLayout.css'
import Header from './Header'


function DashBoardLayout() {

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }
  return (
    <div className='dashboard-layout'>
    <div>
      <Header/> 
    </div>
    <div className='dashboard-container'>
        <img src={Image} alt='My Logo' />
        <div>
           <p className='myBusiness'>+ My Business</p>
        </div>

        <div className='menu'>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img id='dashboard' src={Image2} alt='Dashboard'/>
            <span className='dashboard-text' onClick={toggleDropdown}>Dashboard</span>
            </div>
            <div className={`dropdown-content ${isOpen ? 'show' : 'hide'}`}>
            <ul>
            <li><NavLink className='navlink'to='/createinvoice'>Create Invoice</NavLink></li>
            </ul>
            </div>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img id='dashboard' src={Image3} alt='Dashboard'/>
            <span className='dashboard-text'><NavLink className='navlink' to='/InvoiceList'>Invoices</NavLink></span>
            </div>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img id='dashboard' src={Image4} alt='Dashboard'/>
            <span className='dashboard-text'><NavLink className='navlink' to='/contact'>Contact</NavLink></span>
            </div>
            <button>Subscription</button>
        </div>
    </div>
    </div>
  )
}

export default DashBoardLayout