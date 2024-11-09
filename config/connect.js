const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://rislen30neji:NgvfG4CJnpPhdZCU@cluster0.oipfs.mongodb.net/Stars')
.then(
    () =>{
        console.log('connected to database');
        
    }

)
.catch(
    (err)=>{
        console.log(err);
        
    }
)

module.exports = mongoose; // export lel code bch ykoun accesible l ay file okhra 
// taw temchi l server t'requiri l connect bch yaarefha 