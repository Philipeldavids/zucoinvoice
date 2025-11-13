import React,{useEffect, useState} from "react";
import styles from "./LandingPage.module.css";
import zucoLogo from "../assets/zuco logo.png";
import landingImg from "../assets/zuco landing.png";
import axios from "../api/axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function LandingPage() {

	//const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
 

  useEffect(() => {
	const loggedInUser = sessionStorage.getItem("user");
	if (loggedInUser) {
	  console.log(loggedInUser);
	  setUser(JSON.parse(loggedInUser));
	}
  }, []);
  useEffect(() => {
    const image = document.querySelector(`.${styles.heroImage}`);
    image.classList.add(styles.animateFloat);
  }, []);
  const navigate = useNavigate();

  const handleLogin = async()=>{
	if(!user){
		navigate("/login");
	}
	else{
		navigate("/dashboard");
	}
	
  };

  const pricingPlans = [
    {
      name: "Free Tier",
      price: 0,
      desc: "Get started with 5 free invoice generations — no credit card required!",
      freeLimit: 5,
      highlight: true
    },
    { name: "30 days", price: 5000, desc: "Perfect for quick projects or trials." },
    { name: "90 days", price: 10000, desc: "Best for freelancers and small teams." },
    { name: "6 months", price: 20000, desc: "Ideal for steady business growth." },
    { name: "1 year", price: 30000, desc: "Save more with our annual plan." },
  ];

const handleChoosePlan = async (planName) => {
	if(!user){
		window.location.href = `/signup?plan=${encodeURIComponent(planName)}`;
		return;
	} 
   
    try {
		const res = await axios.post("api/v1/Subscription/select", 
			{plan: planName // request body
		},
		{
			headers: {
			Authorization: `Bearer ${user?.token}`,
			"Content-Type": "application/json"
			}
		});

	

	if (res.data) {
	if (res.data.paymentUrl) {
	window.location.href = res.data.paymentUrl;// redirect to Paystack checkout
		//navigate("/dashboard");
	} else {
	alert(`✅ Successfully subscribed to ${planName} plan!`);
	}
	} else {
	alert("❌ Failed to activate plan. Please try again.");
	}
} catch (err) {
console.error("Subscription error:", err);
alert("Something went wrong while selecting your plan.");
};
}
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <img src={zucoLogo} alt="Zuco Logo" className={styles.logo} />
        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className={styles.authButtons}>
          <button onClick={handleLogin} className={styles.loginBtn}>Login</button>
          <NavLink to="/signup"><button className={styles.signupBtn}>Get Started</button></NavLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Smart, Hassle-Free Invoice Generation</h1>
          <p>
            Save time with automated invoice generation, client management, and
            cloud access—everything your business needs in one tool.
          </p>
          <div className={styles.heroButtons}>
           <NavLink to="/signup"><button className={styles.primaryBtn}>Get Started Free</button></NavLink> 
            <NavLink> <button className={styles.secondaryBtn}>Try Free Demo</button></NavLink> 
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={landingImg} alt="Zuco Dashboard"  />
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <h2>Powerful Features for Modern Businesses</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>⚡ Quick Invoice Generation</h3>
            <p>Generate invoices instantly with auto-filled client data.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📤 Send & Download</h3>
            <p>Send invoices via email or download PDFs effortlessly.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>☁️ Cloud Access</h3>
            <p>Access invoices anywhere, anytime with real-time sync.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>💡 Auto Calculations</h3>
            <p>Taxes, discounts, and totals calculated automatically.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1</span>
            <h4>Sign Up</h4>
            <p>Create an account in seconds with your name and email.</p>
          </div>
          <div className={styles.step}>
            <span>2</span>
            <h4>Create Invoice</h4>
            <p>Enter details and let Zuco auto-calculate totals.</p>
          </div>
          <div className={styles.step}>
            <span>3</span>
            <h4>Send or Download</h4>
            <p>Share invoices instantly or download them as PDFs.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricing}>
        <h2>Simple, Transparent Pricing</h2>
        <div className={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.plan} ${
                plan.highlight ? styles.freePlan : ""
              } ${index === pricingPlans.length - 1 ? styles.proPlan : ""}`}
            >
              <h3>{plan.name}</h3>
              <p>{plan.desc}</p>
              <h4>
                {plan.price === 0 ? "Free" : `₦${plan.price.toLocaleString()}`}
              </h4>
              {plan.freeLimit && (
                <p className={styles.freeLimit}>
                  Includes {plan.freeLimit} free invoice generations
                </p>
              )}
              <ul>
                <li>✓ Cloud access</li>
                <li>✓ Auto calculations</li>
                <li>✓ Download & share invoices</li>
              </ul>
              <button 
			  className={styles.planBtn}
			  onClick={() => handleChoosePlan(plan.name)}>
                {plan.price === 0 ? "Start Free" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <h2>Ready to simplify your invoicing?</h2>
        <p>Join thousands of smart businesses already using Zuco.</p>
        <NavLink to="/signup"> <button className={styles.primaryBtn}>Create Free Account</button></NavLink> 
        <div>Mail for Support: contact@nevida.com.ng </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Zuco — All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};


