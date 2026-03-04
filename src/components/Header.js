import React, {useState, useEffect} from 'react'
import styles from './Header.module.css';
import Image from '../assets/Clip path group.png'
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function Header() {

  const [user, setUser] = useState();
  const [action, setAction] = useState("");
  
 const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      console.log(foundUser);
      setUser(foundUser);
    }
  }, []);

  const handleLogout = () => {
    setUser({});
    sessionStorage.clear();
    navigate('/');
  };
  return (
    <div className={styles.headerapp}>      
    <img id={styles.image1} src={Image} alt='notification'/>
    <nav className={styles.user}>
  <Select
  value={action}
  onChange={(e) => {
    if (e.target.value === "logout") {
      handleLogout();
    }
    setAction("");
  }}
>
  <MenuItem value="logout">Logout</MenuItem>
</Select>
    <p>{user?.email}</p>
    </nav>
    </div>
  )
}

export default Header