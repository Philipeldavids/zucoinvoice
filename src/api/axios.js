import axios from 'axios';

export default axios.create ({
   baseURL: 'https://zucoinvoiceapp.onrender.com/'
    //baseURL: 'https://localhost:44331/'
    //baseURL: 'https://zucoinvoiceapp2.onrender.com/'
});