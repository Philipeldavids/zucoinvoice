import React, { useState, useEffect } from "react";
import styles from "./Contact.module.css";
import axios from "../api/axios";
import DashBoardLayout from "./DashBoardLayout";
import { Modal, Button } from "react-bootstrap";
import DeleteIcon from "../assets/Frame.png"; // same delete icon used in invoice list
import {useNavigate} from 'react-router-dom'

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [show, setShow] = useState(false);
  const [user, setUser] = useState();
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const ADDCONTACT_URL = "api/Contact/AddContact";
  const GETCONTACTS_URL = "api/Contact/GetContactByUser/";
  const DELETECONTACT_URL = "api/Contact/delete/";

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      getContacts(foundUser?.id);
    }
    else{
        navigate("/login");
    }
  }, [navigate]);

  const getContacts = async (userId) => {
    try {
      const response = await axios.get(GETCONTACTS_URL + userId);
      if (response.status === 200) {
        setContacts(response.data);
        setFilteredContacts(response.data);
      } else {
        alert("Error fetching contacts");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        ADDCONTACT_URL,
        {
          customerName: name,
          customerEmail: email,
          customerAddress: address,
          customerPhoneNumber: phonenumber,
          userId: user?.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        handleClose();
        setName("");
        setEmail("");
        setAddress("");
        setPhoneNumber("");
        getContacts(user?.id);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleDelete = async (Id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await axios.delete(DELETECONTACT_URL + Id);
      if (response.status === 200) {
        alert("Contact deleted successfully");
        getContacts(user?.id);
      } else {
        alert("Error deleting contact");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Search contacts by name or email
  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.customerName.toLowerCase().includes(lowerQuery) ||
        contact.customerEmail.toLowerCase().includes(lowerQuery)
    );
    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [query, contacts]);

  // Pagination logic
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / entriesPerPage);

  return (
    <div>
      <DashBoardLayout />
      <div className={styles.invoicelist_container}>
        <div id={styles.invoice_header}>
          <h4>Contact</h4>
          <button onClick={handleShow} id={styles.createnewbtn}>
            Create New
          </button>
        </div>

        <div id={styles.params}>
          <div id={styles.shownumber}>
            <p>Show</p>
            <input
              type="number"
              id={styles.numberentry}
              min="1"
              max="50"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            />
            <p>entries</p>
          </div>
          <div id={styles.search}>
            <p>Search</p>
            <input
              type="text"
              id={styles.searchentry}
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <ul className={styles.invoicelist}>
            <li>Name</li>
            <li>Email</li>
            <li>Address</li>
            <li>PhoneNumber</li>
            <li>Action</li>
          </ul>

          {currentContacts.map((contact) => (
            <ul key={contact.contactId} className={styles.invoicelistitem}>
              <li>{contact.customerName}</li>
              <li>{contact.customerEmail}</li>
              <li>{contact.customerAddress}</li>
              <li>{contact.customerPhoneNumber}</li>
              <li>
                <img
                  src={DeleteIcon}
                  alt="delete"
                  id={styles.delete}
                  onClick={() => handleDelete(contact.contactId)}
                  style={{ cursor: "pointer" }}
                />
              </li>
            </ul>
          ))}
        </div>

        <div id={styles.invoicelistnav}>
          <p>
            Showing {indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredContacts.length)} of{" "}
            {filteredContacts.length} entries
          </p>
          <div id={styles.invoicenavbtn}>
            <button
              type="button"
              id={styles.prevbtn}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              type="button"
              id={styles.nextbtn}
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : prev
                )
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create New Contact Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add A Contact Detail</Modal.Title>
        </Modal.Header>
        <form>
          <Modal.Body>
            <div>
              <Modal.Title>Name</Modal.Title>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                value={name}
              />
              <Modal.Title>Email</Modal.Title>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                value={email}
              />
              <Modal.Title>Address</Modal.Title>
              <input
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                value={address}
              />
              <Modal.Title>PhoneNumber</Modal.Title>
              <input
                type="text"
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="PhoneNumber"
                value={phonenumber}
              />
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
  );
}

export default Contact;
