const express = require('express');
const router = express.Router();
const Star = require('../models/star');
const multer = require('multer');


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

// Creating a new Star
router.post('/create', upload.any('photo'), async (req, res) => { //any : nombre illimité mte3 tsawer fel upload

    try {
        data = req.body;
        star = new Star(data);
        star.dateDeFormation = new Date();
        star.photo = filename;
        star.comments = data.comments.split(',');
        savedStar = await star.save();
        filename = '';
        res.status(200).send(savedStar);


    } catch (error) {
        res.status(400).send(error);

    }

})

// Reading All Stars 

router.get('/getStars', (req, res) => {
    Star.find() //yfarkes aal stars mte3i lkol
        .then(
            (stars) => {
                res.status(200).send(stars)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err);
            }
        )

}
)

// Deleting a Star

router.delete('/deleteStar/:id', async (req, res) => {
    try {
        myid = req.params.id
        star = await Star.findOneAndDelete({ _id: myid })
        res.status(200).send(star)

    } catch (err) {
        res.status(400).send(err)
    }
})
// get a star by his id
router.get('/getStar/:id', async (req, res) => {
    try {
        myid = req.params.id;
        star = await Star.findById({ _id: myid })
        res.status(200).send(star)

    } catch (err) {
        res.status(400).send(err)
    }
})

// Updating a Star

router.put('/updateStar/:id', upload.any('image'), async (req, res) => {
    try {
        myid = req.params.id
        newData = req.body
    // si on a modifier les commentaires
        if (newData.comments) {
            newData.comments = newData.comments.split(',');
        }
    //si on a modifier l'image de Star
        if (req.files && req.files.length > 0) {
            filename = req.files[0].filename;
            newData.photo = filename;
        }
        updated = await Star.findByIdAndUpdate({ _id: myid }, newData, { new: true })
        filename = '';
        res.status(200).send(updated)
    }
    catch (err) {
        res.status(400).send(err)
    }
})
 // Update the star without checking for image
router.put('/StarUpdate/:id', async (req, res) => {
    try {
        const myid = req.params.id;
        let newData = req.body;
        
        const updated = await Star.findByIdAndUpdate({ _id: myid }, newData, { new: true });
        res.status(200).send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});




module.exports = router;