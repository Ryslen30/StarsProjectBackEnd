const express = require('express'); 
const cors = require('cors');// import lel cors
const starApi = require('./routes/star');
const adminApi = require('./routes/admin');
const userAPi = require('./routes/user');
require('./config/connect'); // import lel connect


const app = express(); // sna3t app bch tekhou les fonctionnalités mte3 l express
app.use(cors({
    origin: 'http://localhost:4200' // Replace with the actual origin if different
  }));
app.use(express.json()); // bch t9bel l format json
app.use('/star' , starApi); 
app.use('/admin' , adminApi);
app.use('/user' , userAPi);
app.use('/getimage', express.static('./uploads'));
app.listen(3000 , ()=>{
    console.log('Server works'); 
})