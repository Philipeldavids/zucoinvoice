import React, { useState, useEffect, useCallback } from 'react';
import Image from '../assets/zucoinvoiceapplogo.png';
import Image2 from '../assets/business 1.png';
import Image3 from '../assets/invoice 1.png';
import Image4 from '../assets/Vector.png';
import Image5 from '../assets/settings-svgrepo-com.png';
import { NavLink } from 'react-router-dom';
import styles from './DashBoardLayout.module.css';
import Header from './Header';
import axios from '../api/axios';
import { Modal, Button } from 'react-bootstrap';

function DashBoardLayout() {
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const ADDBUSINESS_URL = 'api/v1/Account/AddCompany';

  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.put(ADDBUSINESS_URL, {
        userid: user?.id,
        text: text,
      });

      if (response.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        alert('Business added successfully');
        handleClose();
      } else {
        alert('Failed to add business');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding business');
    }
  }, [user, text]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={styles.dashboard_layout}>
      <div>
        <Header />
      </div>

      <div className={styles.dashboard_container}>
        <NavLink to="/"><img src={Image} alt="My Logo" className={styles.logo} /></NavLink>
        <br />
        <br />

        {user?.company ? (
          <button
            className={styles.myBusiness}
            style={{ background: 'none', border: 'none' }}
            onClick={handleShow}
          >
            + {user.company}
          </button>
        ) : (
          <button
            className={styles.myBusiness}
            style={{ background: 'none', border: 'none' }}
            onClick={handleShow}
          >
            + Add Business
          </button>
        )}

        <div className={styles.menu}>
          <div className={styles.menuItem}>
            <img className={styles.icon} src={Image2} alt="Dashboard" />
            <span className={styles.dashboard_text} onClick={toggleDropdown}>
              Dashboard
            </span>
          </div>

          {isOpen && (
            <ul className={styles.dropdown_content}>
              <li>
                <NavLink className={styles.navlink} to="/createinvoice">
                  Create Invoice
                </NavLink>
              </li>
            </ul>
          )}

          <div className={styles.menuItem}>
            <img className={styles.icon} src={Image3} alt="Invoices" />
            <NavLink className={styles.navlink} to="/InvoiceList">
              Invoices
            </NavLink>
          </div>

          <div className={styles.menuItem}>
            <img className={styles.icon} src={Image4} alt="Contact" />
            <NavLink className={styles.navlink} to="/contact">
              Contact
            </NavLink>
          </div>

          <div className={styles.menuItem}>
            <img className={styles.icon} src={Image5} alt="Settings" />
            <NavLink className={styles.navlink} to="/usersettings">
              Settings
            </NavLink>
          </div>

          <div style={{ marginTop: 80, marginLeft: 50 }}>
            <NavLink to="/subscription">
              <button id={styles.sub}>Subscription</button>
            </NavLink>
          </div>
        </div>

        {/* Add Business Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add a Business Name</Modal.Title>
          </Modal.Header>
          <form>
            <Modal.Body>
              <input
                type="text"
                className="form-control"
                placeholder="Enter business name"
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
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
    </div>
  );
}

export default DashBoardLayout;
