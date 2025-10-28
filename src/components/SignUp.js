import React, { useState, useEffect } from 'react';
import styles from './Signup.module.css';
import axios from '../api/axios';
import { NavLink, useLocation } from 'react-router-dom';
import Select from 'react-select';
import Flag from 'react-world-flags';
import Logo from '../assets/zucoinvoiceapplogo.png';
import { ToastContainer, toast } from "react-toastify";

function SignUp() {
  const [plan , setPlan] = useState('');
  const [username, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
   const [loading, setLoading] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  
const location = useLocation();
  const togglePasswordVisibility = () => setVisible(!visible);
  const toggleConfirmPasswordVisibility = () => setConfirmVisible(!confirmVisible);

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      //const status = params.get("status");
      const planName = params.get("plan");
    if(planName){
      setPlan(planName);
    }
  },[location])

  // ✅ Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags");
        const data = await response.data;

        // filter out invalid entries and build dial codes properly
        const countries = data.map((country) => ({
  code: country.cca2,
  name: country.name.common,
  dial_code: country.idd?.root
    ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "")
    : "",
  flag: country.flags?.png,
}));
setCountriesList(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // ✅ Map options for react-select
  const options = countriesList.map((country) => ({
    value: country.dial_code,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Flag
          code={country.code}
          style={{ width: 24, marginRight: 8, borderRadius: '3px' }}
        />
        <span>{country.name}</span>
        <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
          {country.dial_code}
        </span>
      </div>
    ),
    searchLabel: `${country.name} ${country.dial_code}`,
  }));

  const REGISTER_URL = '/api/Auth/AddUser';
   
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      alert('Please select your country code');
      return;
    }

    const phone = phoneNumber.startsWith('0')
      ? phoneNumber.slice(1)
      : phoneNumber;
    const fullPhone = `${selectedOption.value}${phone}`;

    try {
      const response = await axios.post(REGISTER_URL, {
        email: username,
        phonenumber: fullPhone,
        password,
        confirmPassword,
      });
      setLoading(true);
      if (response.status === 200) {
        alert('Registration successful, Please login');
        window.location.href = `/login?plan=${encodeURIComponent(plan)}`;
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      // alert('Error during registration');
      toast.error("Error during registration! Kindly try again", { position: 'top-right'});
        }
        finally{
          setLoading(false);
    
        }
  };

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '30px' }}>
      <NavLink to="/"><img src={Logo} alt="logo" /></NavLink>
      </div>
    
    <div className={styles.signup_container}>
      <div>
        <h2 className={styles.start}>Get Started</h2>
        <p className={styles.start2}>
          Already have an account? <NavLink to="/login">Sign In</NavLink>
        </p>
      </div>

      <form className={styles.signup_form} onSubmit={handleSignIn}>
        <label className={styles.label}>Email Address</label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Email Address"
          required
        />

        <label className={styles.label}>Phone Number</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Select Country"
            isSearchable={true}
            filterOption={(option, input) =>
              option.data.searchLabel
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            styles={{
              container: (base) => ({ ...base, width: '160px' }),
              control: (base) => ({
                ...base,
                borderColor: '#ccc',
                borderRadius: '8px',
                minHeight: '45px',
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter Phone Number"
            style={{ flex: 1, marginLeft: '10px' }}
            required
          />
        </div>

        <label className={styles.label}>Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <i
            className={`material-icons ${styles.icon}`}
            onClick={togglePasswordVisibility}
          >
            {visible ? 'visibility' : 'visibility_off'}
          </i>
        </div>

        <label className={styles.label}>Confirm Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={confirmVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <i
            className={`material-icons ${styles.icon}`}
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmVisible ? 'visibility' : 'visibility_off'}
          </i>
        </div>

        <p className={styles.underlay}>
          By creating an account, you agree to our{' '}
          <span>Terms and Conditions</span>
        </p>
            {loading && <div className={styles.spinner}></div>}                    
                      
        <button type="submit" id={styles.createaccount}>
          Create Account
        </button>
      </form>
    </div>
    <ToastContainer/>
    </>
  );
}

export default SignUp;
