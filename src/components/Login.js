import React, {useState} from 'react';
import './Login.css'
import axios from "../api/axios"
import { NavLink, useNavigate} from 'react-router-dom';


function Login() {

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);


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
  const navigate = useNavigate();

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
        navigate("/dashboard");
      }
      else{
        alert('Authentication failed');      
      }
    }
    catch(error){
      console.error('Login error:', error);
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <div className="login-page">
      <div className= "login-container">
        <br/>
        <h2 className='welcome'>Welcome Back! SignIn</h2>
        <form className='login-form'>
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
          <input type={visible? 'text':'password'} 
          placeholder='Password'           
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
           <i className={`material-icons ${visible ? 'visible' : 'hidden'}`}  
          onClick={togglePasswordVisibility}          
          >
            {visible ? 'visibility' : 'visibility_off'}</i>
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>
          <div className='remember-me'>
              
              <input type='checkbox' className='checkbox'/>
              <p className='underlay1'>Remember me</p>            
              <p className='underlay2'>Forgot password</p>
          </div><br/>

          <div className='login-signup'>
          {loading && <div className='spinner'></div>}  
          <button type='submit' className='button'onClick={(event)=>handleLogin(event)} disabled={loading}>Sign In</button>
          <NavLink to='/'>Sign Up</NavLink>
          
          </div>
        </form>
        </div>
    </div>
  )
}

export default Login