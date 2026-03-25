import React, { useEffect, useState } from 'react'
import DashBoardLayout from './DashBoardLayout'
import styles from './Home.module.css';
import Image1 from '../assets/image 1.png';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";



function Dashboard() {

  const location = useLocation();
    const [showLimitModal, setShowLimitModal] = useState(false);
const [usage, setUsage] = useState({ used: 0, limit: 5 });
const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    //const status = params.get("status");
    const message = params.get("message");
   // const planName = params.get("plan");
    if (message) {
      alert(message); // or show a toast/snackbar
    }
   
  }, [location]);
 
  useEffect(() => {
  const checkSubscription = async () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) return;

      // Get subscription
      const subRes = await axios.get(`api/v1/subscription/current/${storedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const hasSubscription = subRes.data?.hasActiveSubscription;

      // Get invoice usage
      // const usageRes = await axios.get(`api/v1/invoice/usage/${storedUser.id}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      const used = subRes.data?.invoicesUsed || 0;
      const limit = subRes.data?.freeLimit || 5;

      setUsage({ used, limit });

      // 🚨 Show modal if limit reached and no subscription
      if (!hasSubscription && used >= limit) {
        setShowLimitModal(true);
      }

    } catch (err) {
      console.error("Subscription check failed", err);
    }
  };

  checkSubscription();
}, []);
  return (
    
    <div>
        <DashBoardLayout/>
        <div className={styles.homeContent}>
            <h3>Dashboard
              </h3>
              <p>Income</p>
              <p>Expense</p>
              <img src={Image1} alt='profit&loss'/>
        </div>
        <Modal show={showLimitModal} backdrop="static"  centered>
  <Modal.Header>
    <Modal.Title>Free Limit Reached</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <p>
      You have used <strong>{usage.used}/{usage.limit}</strong> free invoices.
    </p>
    <p>
      Your free trial has ended. Please subscribe to continue generating invoices.
    </p>
  </Modal.Body>

  <Modal.Footer>
    {/* <Button variant="secondary" onClick={() => setShowLimitModal(false)}>
      Maybe Later
    </Button> */}
    <Button variant="primary" onClick={() => navigate("/subscription")}>
      Subscribe Now
    </Button>
  </Modal.Footer>
</Modal>
       
    </div>
  )
}

export default Dashboard