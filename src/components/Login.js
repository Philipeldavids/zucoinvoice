import React, {useState, useEffect} from 'react';
import styles from './Login.module.css';
import axios from "../api/axios";
import { NavLink, useLocation} from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from '../assets/zucoinvoiceapplogo.png';


function Login() {
  const location = useLocation();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan , setPlan] = useState('');

   useEffect(() => {
        const params = new URLSearchParams(location.search);
        //const status = params.get("status");
        const planName = params.get("plan");
      if(planName){
        setPlan(planName);
      }
    },[location]);

   const handleChoosePlan = async (user) => {
                
              try {
          const res = await axios.post("api/v1/Subscription/select", 
            {plan: plan // request body
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
        alert(`✅ Successfully subscribed to ${plan} plan!`);
        }
        } else {
        alert("❌ Failed to activate plan. Please try again.");
        }
      } catch (err) {
      console.error("Subscription error:", err);
      alert("Something went wrong while selecting your plan.");
      }
      };


  
   // Handle input change
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Validate form inputs
  const validate = () => {
    const errors = {};

    // Email validation
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)
    ) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };
  const LOGIN_URL = '/api/Auth/Login';
  

  const handleLogin = async (event)=>{  
    event.preventDefault();
    setLoading(true)

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Form submitted successfully", formValues);
      // Perform login API call here
    }

    try{
      const response = await axios.post(LOGIN_URL, {
        email: formValues.email,
        password: formValues.password
    }, {
      // headers: {
      //   "Content-Type": "Application/json"
      // }

      
    });
      if(response.status === 200){
        
       sessionStorage.setItem('user', JSON.stringify(response.data))
       if(plan){
        handleChoosePlan(response.data);
          window.location.href = `/dashboard?plan=${encodeURIComponent(plan)}`;
       }     
        window.location.href = `/dashboard`;
      }
      else{
        alert("Incorrect Credentials");
          };    
      }
    
    catch(error){
      console.error('Login error:', error);
      toast.error("Error Notification! Kindly check your login credentials", { position: 'top-right'});
    }
    finally{
      setLoading(false);

    }
  }
  return (
    <>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '30px' }}>
  <NavLink to="/"><img src={Logo} alt="logo" /></NavLink>
  </div>

     
<div className={ styles.login_page }>      
      <div className={ styles.login_container }>
        <br/>
        <h2 className={styles.welcome}>Welcome Back! SignIn</h2>
        <form className={styles.login_form}>
          <div>
          <label>Email Address</label><br/>
          <input 
          placeholder='Email Address'
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>        
        <div>
          <label>Password</label><br/>
          <div style={{display: "flex", flexDirection:"row"}}> 
         <input type={visible? 'text':'password'} 
          placeholder='Password'           
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
        <i className={`material-icons ${styles.icon}`}  
   onClick={togglePasswordVisibility}>
  { visible ? 'visibility' : 'visibility_off' }
</i>
  </div>           {/* <i className={`${styles.material_icons} ${visible ? styles.visible : styles.hidden}`}  
          onClick={togglePasswordVisibility}          
          >
            { visible ? 'visibility' : 'visibility_off' }</i> */}
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>
          <div className={styles.remember_me}>
              <div style={{display: "flex", flexDirection: "row", width: 110, justifyContent: "space-between"}}>
                  <input type='checkbox' className={styles.checkbox}/>
              <p className={styles.underlay1}>Remember me</p>  

              </div>
                    
 
              <NavLink to="/forgotpassword" className={styles.underlay2}>Forgot password</NavLink>
          </div><br/>
          {loading && <div className={styles.spinner}></div>}
          <div className={ styles.login_signup } >
          
          <button type='submit' className={styles.button} onClick={(event)=>handleLogin(event)} disabled={loading}>Sign In</button>
          
          <NavLink to='/signup'>Sign Up</NavLink>
          
          </div>
        </form>
        </div>
    </div>
    <ToastContainer />
    </>
    
  )
}

export default Login