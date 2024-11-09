const express = require('express');
const router= express.Router();
const Admin = require('../models/admin');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


filename = '';
// Gestion des fichiers et stockage dans la repertoire Uploads 
const mystorage = multer.diskStorage(
    {
        destination: './uploads',
        filename: (req, file, redirect) => {
            let date = Date.now();
            let fl = date + "." + file.mimetype.split('/')[1]; //mimetype traja3 (image/png) donc [1] tekhou png mathalan (type)
            redirect(null, fl);
            filename = fl;
        }
    }
)
const upload = multer({ storage: mystorage }); // sna3t middleware ( haja bch tekhdem bin l appel te3 request te3i wel function )


// Adding admins to the list of admins

router.post('/register', upload.any('photo'), async (req, res) => { //any : nombre illimité mte3 tsawer fel upload

    try {
        data = req.body;
        admin = new Admin(data);
        admin.photo = filename;
        salt = bcrypt.genSaltSync(10);
        admin.password = bcrypt.hashSync(data.password, salt);
        savedAdmin = await admin.save();
        filename = '';
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
        user = await User.findOne({_id:myid})
        res.send(user)

        
    } catch (err) {
        res.send(err)
        
    }
})

//Delete admin 
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
