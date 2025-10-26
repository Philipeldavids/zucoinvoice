import React, { useState, useEffect } from "react";
import axios from '../api/axios';
import { PaystackButton } from "react-paystack";
import styles from "./Subscription.module.css";
import DashBoardLayout from './DashBoardLayout';

const plans = [
  { name: "30 days", price: 5000 },
  { name: "90 days", price: 10000 },
  { name: "6 months", price: 20000 },
  { name: "1 year", price: 30000 },
];

export default function SubscriptionPage() {
  const publicKey = "pk_test_33885714e7aa0a38c1ef242652828db5404a83e4"; // Replace with your Paystack public key
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      console.log(loggedInUser);
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

useEffect(() => {
  const fetchSubscription = async () => {
    // ✅ Ensure user is defined before fetching
    if (!user || !user?.id) return;

    console.log("Fetching subscription for user:", user?.id);

    try {
      const res = await axios.get(`api/v1/Subscription/current/${user?.id}`);
      setSubscription(res.data);
    } catch (err) {
      console.error("Failed to fetch subscription:", err.response?.data || err.message);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  fetchSubscription();
}, [user?.id, user]);


  const onSuccess = async (reference) => {
    console.log(reference);
    try {
      const res = await axios.post("api/v1/Paystack/verify", {
        userId: user?.id,
        planName: selectedPlan.name,
        reference: reference.reference,
      });
      setMessage(res.data.message || "Payment verified successfully!");
      setSelectedPlan(null);
      // Refresh subscription info
      const refreshed = await axios.get(`api/v1/Subscription/current/${user?.id}`);
      setSubscription(refreshed.data);
    } catch (err) {
      console.log(err);
      setMessage("Error verifying payment");
    }
  };

  const onClose = () => setMessage("Payment window closed.");

  const daysLeft = subscription?.remainingDays || 0;
  const isSubscribed = subscription?.hasActiveSubscription;

  if (loading) return <p className={styles.loading}>Loading subscription info...</p>;

  return (
    <div>
      <DashBoardLayout/>
  
    <div className={styles.subscriptionContainer}>

      <h2 className={styles.subscriptionTitle}>Your Subscription</h2>

      {/* Subscription or Free Trial Status */}
      {subscription && (
        <div className={styles.statusCard}>
          {isSubscribed ? (
            <>
              <h3>Active Plan: {subscription.planName}</h3>
              <p>{subscription.message}</p>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${(daysLeft / 365) * 100}%` }}
                />
              </div>
              <p className={styles.daysLeft}>
                {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
              </p>
            </>
          ) : (
            <>
              <h3>{subscription.planName}</h3>
              <p>{subscription.message}</p>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${
                      (subscription.invoicesUsed / subscription.freeLimit) * 100
                    }%`,
                  }}
                />
              </div>
              <p>
                {subscription.invoicesUsed}/{subscription.freeLimit} invoices used
              </p>
            </>
          )}
        </div>
      )}

      {/* Subscription Plans */}
      <h3 className={styles.plansHeading}>Upgrade / Renew Plan</h3>
      <div className={styles.plansGrid}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`${styles.planCard} ${
              selectedPlan?.name === plan.name ? styles.selected : ""
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h3 className={styles.planName}>{plan.name}</h3>
            <p className={styles.planPrice}>₦{plan.price}</p>
          </div>
        ))}
      </div>

      {/* Paystack Button */}
      {selectedPlan && (
        <div className={styles.paystackSection}>
          <PaystackButton
            email={user?.email}
            amount={selectedPlan.price * 100}
            publicKey={publicKey}
            text={`Pay ₦${selectedPlan.price}`}
            onSuccess={onSuccess}
            onClose={onClose}
            className={styles.paystackButton}
          />
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
      </div>
  );
}
