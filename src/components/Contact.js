import React, {useState, useEffect} from 'react'
import './Contact.css'
import axios from '../api/axios'
import DashBoardLayout from './DashBoardLayout'
import { Modal, Button } from 'react-bootstrap';

function Contact() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [show, setShow] = useState(false);     
    const [user, setUser] = useState();
    const [contacts, setContacts] = useState([]);
    //const [showContact, setShowContact] = useState(false);

    const ADDCONTACT_URL = "api/Contact/AddContact";
    const GETCONTACTS_URL = "api/Contact/GetContactByUser/";

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);         
          setUser(foundUser); 
          getContact(foundUser?.id);            
        }
      }, []);

      

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


    const handleSubmit = async(e) => {
        e.preventDefault();
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
                getContact(user?.id);             
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
                <div id='invoice-header'> 
                <h4>Contact</h4>
                <button onClick={handleShow} id='createnewbtn'>Create New</button>
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

                    <ul className='invoicelist'>
                        <li>Name</li>
                        <li>Email</li>
                        <li>Address</li>
                        <li>PhoneNumber</li>
                    </ul>
                    {
                     contacts.map((contact) => (
                        <ul key={contact.contactId} className='invoicelistitem'>
                        <li>{contact.customerName}</li>
                        <li>{contact.customerEmail}</li>
                        <li>{contact.customerAddress}</li>
                        <li>{contact.customerPhoneNumber}</li>
                    </ul>
                        )
                    )
                }
                </div>
                <div id='invoicelistnav'>
                    <p>Showing 0 to 0 of 0 entries</p>
                    <div id='invoicenavbtn'>
                        <button type='submit' id='prevbtn'>Previous</button>
                        <button type='submit' id='nextbtn'>Next</button>
                    </div>
                </div>
            </div>

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
        </div>
        
      )
      
    }

export default Contact