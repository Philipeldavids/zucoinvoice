import React, { useState, useEffect, useCallback } from 'react'
import Image from '../assets/zucoinvoiceapplogo.png'
import Image2 from '../assets/business 1.png'
import Image3 from '../assets/invoice 1.png'
import Image4 from '../assets/Vector.png'
import Image5 from '../assets/settings-svgrepo-com.png'
import { NavLink } from 'react-router-dom'
import './DashBoardLayout.css'
import Header from './Header'
import axios from '../api/axios'
import { Modal, Button } from 'react-bootstrap';


function DashBoardLayout() {

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);   
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [user, setUser] = useState();
  const [showBusiness, setShowBusiness] = useState(false);
 
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);       
      setUser(foundUser);           
    }
  }, []);
   
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);


  const ADDBUSINESS_URL = "api/v1/Account/AddCompany"
  const handleSubmit= useCallback(async ()=>{  
      
      try{
        const response = await axios.put(ADDBUSINESS_URL, {
          userid : user?.id,
          text: text
          
      }, {
        // headers: {
        //   "Content-Type": "Application/json"
        // }
  
        
      });
        if(response.status === 200){        
        
        sessionStorage.setItem("user", response.data);       
        alert('Registration successful');
        handleClose();
                
        }
        else{
          alert('Registration failed');
        }
      }
      catch(error){
        console.log('error:', error);
      }
    }, [user, text]);

    useEffect(() => {
      setShowBusiness(true);
    }, []);
    
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
        <br/><br/>


          {showBusiness?
           <button style={{ background:'none', border:'none' }} onClick={handleShow} className='myBusiness'>+ {user?.company}</button> :
           <button  style={{ background:'none', border:'none' }} onClick={handleShow}className='myBusiness'>+ Add Business</button>}
          
       

        <div className='menu'>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img className='dashboard' src={Image2} alt='Dashboard'/>
            <span className='dashboard-text' onClick={toggleDropdown}>Dashboard</span>
            </div>
            <div className={`dropdown-content ${isOpen ? 'show' : 'hide'}`}>
            <ul>
            <li><NavLink className='navlink'to='/createinvoice'>Create Invoice</NavLink></li>
            </ul>
            </div>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img className='dashboard' src={Image3} alt='Dashboard'/>
            <span className='dashboard-text'><NavLink className='navlink' to='/InvoiceList'>Invoices</NavLink></span>
            </div>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img className='dashboard' src={Image4} alt='Dashboard'/>
            <span className='dashboard-text'><NavLink className='navlink' to='/contact'>Contact</NavLink></span>
            </div>
            <div style={{display:"flex", alignItems: 'center', flexDirection: 'row'}}>
            <img className='dashboard' src={Image5} alt='Dashboard'/>
            <span className='dashboard-text'><NavLink className='navlink' to='/usersettings'>Settings</NavLink></span>
            </div>
            <div style={{ marginTop: 80, marginLeft: 50 }}>
            <button onClick={handleShow2}>Subscription</button>
            </div>
            
            
            
        </div>
        
        <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add A Business Name</Modal.Title>
                </Modal.Header>
                <form>
                <Modal.Body><input type="text" onChange={(e)=> setText(e.target.value)} value={text}></input></Modal.Body>
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

            <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header closeButton>
                    <Modal.Title>Subscription</Modal.Title>
                </Modal.Header>
                <form>
                <Modal.Body>
                <Modal.Title>Standard</Modal.Title>
                  <input type="radio" name='sub' onChange={(e)=> setText(e.target.value)} value={text}></input>
                  <Modal.Title>Premium</Modal.Title>
                  <input type="radio" name='sub' onChange={(e)=> setText(e.target.value)} value={text}></input>
                  </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
    </div>
        
    </div>
  )
}

export default DashBoardLayout