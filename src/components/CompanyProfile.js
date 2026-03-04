import { useEffect, useState } from "react";
import axios from "../api/axios";
import styles from "./CompanyProfile.module.css";
import DashBoardLayout from './DashBoardLayout';
import { useNavigate } from 'react-router-dom';

export default function CompanyProfile() {
  const [form, setForm] = useState({
    companyName: "",
    address: "",
    phoneNumber: "",
    email: "",
    website: "",
    logoUrl: ""
  });

  //const [user, setUser] = useState();
 const navigate = useNavigate();

  useEffect(() => {
      const fetchCompany = async () => {
  try {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    const res = await axios.get("api/v1/settings/getcompany", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setForm(res.data);
  } catch (err) {
    console.error("401 or token issue:", err.response?.status);
    if (err.response?.status === 401) {
      navigate("/login");
    }
  }

      };
  fetchCompany();
      
    }, [navigate]);
  
//  useEffect(() => {
   
// }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
   const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const token = storedUser?.token;

await axios.post("api/v1/settings/savecompany", form, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    alert("Company settings saved!");
  };

  return (
    <>
    
    <DashBoardLayout />
    <div className={styles.container}>
      <h2 className={styles.header}>Company Settings</h2>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Company Name</label>
          <input className={styles.input} name="companyName" value={form.companyName} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input className={styles.input} name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        </div>

        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label className={styles.label}>Address</label>
          <input className={styles.input} name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Website</label>
          <input className={styles.input} name="website" value={form.website} onChange={handleChange} />
        </div>

        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label className={styles.label}>Logo URL</label>
          <input className={styles.input} name="logoUrl" value={form.logoUrl} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={save}>
          Save Settings
        </button>
      </div>
    </div>
    </>
  );
}