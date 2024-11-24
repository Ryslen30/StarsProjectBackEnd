const express = require('express');
const router= express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





// Adding users to the list of users

router.post('/register', async (req, res) => { 

    try {
        data = req.body;
        user = new User(data);
        salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(data.password, salt);
        savedUser = await user.save();
        res.status(200).send(savedUser);

    } catch (error) {
        res.status(400).send(error);

    }

})
// Get all users

router.get('/getUsers', async (req, res) => {
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

// Log in user

router.post('/login' , async(req, res)=>{
    try{
    const data=req.body;
    const user= await User.findOne({email : data.email});
    if(!user){
        res.status(404).send('email or pass invalid !')
    }else{
        validpass = await bcrypt.compareSync(data.password , user.password); // l compareSync traja3 true wala false
        if(!validpass){ // validpass=false
            res.status(401).send('email or pass invalid')
        }
        else{
            let payload = {
                _id: user._id,
                email : user.email,
                 name : user.username,
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







// Get single user
router.get('/getUserByid/:id' , async(req , res)=>{
    try {
        myid= req.params.id
        user = await User.findOne({_id:myid})
        res.send(user)

        
    } catch (err) {
        res.send(err)
        
    }
})
//update user
router.put('/userUpdate/:id', async (req, res) => {
    try {
        const myid = req.params.id;
        const { currentPassword, newPassword } = req.body;

        // Fetch the admin by ID
        const user = await User.findById(myid);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
           
  

        // Compare current password with hashed password in the database
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

        // Update the password
        user.password = hashedNewPassword;

        const updated = await user.save();
        return res.status(200).send({ message: 'Password updated successfully', updated });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'An error occurred', error: err.message });
    }
});
//Delete user 
router.delete('/deleteid/:id' ,  async (req , res)=> {
    try {
        myid= req.params.id
        user= await User.findOneAndDelete({_id:myid})
        res.send(user)

    } catch (err) {
        res.send(err)
    }
});

module.exports = router ;
