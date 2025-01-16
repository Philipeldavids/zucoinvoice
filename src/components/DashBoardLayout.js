import React, {useState, useEffect} from 'react'
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
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [user, setUser] = useState();
  const [showBusiness, setShowBusiness] = useState(false);
  const [company, setCompany] = useState();
  
    useEffect(() => {
      const loggedInUser = sessionStorage.getItem("user");
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);       
        setUser(foundUser);
        setShowBusiness(true);     
      }
    }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const ADDBUSINESS_URL = "api/v1/Account/AddCompany"
  const handleSubmit= async ()=>{  
      
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
        
        setUser(response.data);        
        alert('Registration successful');
        handleClose();
                
        }
        else{
          alert('Registration failed');
        }
      }
      catch(error){
        console.error('error:', error);
      }
    }

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

          {showBusiness ?
           <a variant="primary" onClick={handleShow}className='myBusiness'>+ {user?.company}</a> :
           <a variant="primary" onClick={handleShow}className='myBusiness'>+ My Business</a>}
          
       

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
            <button>Subscription</button>
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
            
    </div>
        
    </div>
  )
}

export default DashBoardLayout