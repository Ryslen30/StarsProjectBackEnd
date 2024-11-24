const express = require('express');
const router= express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//adding admin
router.post('/register', async (req, res) => { 

    try {
        data = req.body;
        admin = new Admin(data);
        salt = bcrypt.genSaltSync(10);
        admin.password = bcrypt.hashSync(data.password, salt);
        savedAdmin = await admin.save();
        res.status(200).send(savedAdmin);

    } catch (error) {
        res.status(400).send(error);

    }

})
// Get all admins

router.get('/getAdmins', async (req, res) => {
    Admin.find()
    .then(
        (admin) =>{
            res.status(200).send(admin);
        }
    )
    .catch(
        (err) => {
            res.status(400).send(err);
        }
    );

});

// Log in admin

router.post('/login' , async(req, res)=>{
    try{
    const data=req.body;
    const admin= await Admin.findOne({email : data.email});
    if(!admin){
        res.status(404).send('email or pass invalid !')
    }else{
        validpass = await bcrypt.compareSync(data.password , admin.password); // l compareSync traja3 true wala false
        if(!validpass){ // validpass=false
            res.status(401).send('email or pass invalid')
        }
        else{
            let payload = {
                _id: admin._id,
                email : admin.email,
                 name : admin.username,
            }
            token = jwt.sign(payload , '301104',  { expiresIn: '1h' })
            res.status(200).send({mytoken : token})
        }
    }

    }
    catch(err){
        res.status(500).send(err)
    }

})
// Get single admin
router.get('/getAdminByid/:id' , async(req , res)=>{
    try {
        myid= req.params.id
        admin = await Admin.findOne({_id:myid})
        res.send(admin)

        
    } catch (err) {
        res.send(err)
        
    }
})
//Delete admin 
router.delete('/deleteid/:id' ,  async (req , res)=> {
    try {
        myid= req.params.id
        admin= await Admin.findOneAndDelete({_id:myid})
        res.send(admin)

    } catch (err) {
        res.send(err)
    }
});

//Update admin


router.put('/adminUpdate/:id', async (req, res) => {
    try {
        const myid = req.params.id;
        const { currentPassword, newPassword } = req.body;

        // Fetch the admin by ID
        const admin = await Admin.findById(myid);

        if (!admin) {
            return res.status(404).send({ message: 'Admin not found' });
        }
         

        // Compare current password with hashed password in the database
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

        // Update the password
        admin.password = hashedNewPassword;

        const updated = await admin.save();
        return res.status(200).send({ message: 'Password updated successfully', updated });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'An error occurred', error: err.message });
    }
});


module.exports = router ;
