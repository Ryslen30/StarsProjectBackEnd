const express = require('express');
const router = express.Router();
const Star = require('../models/star');
const Comment = require('../models/Comment');
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

// router.put('/updateStar/:id', upload.any('image'), async (req, res) => {
//     try {
//         myid = req.params.id
//         newData = req.body
//     // si on a modifier les commentaires
//         if (newData.comments) {
//             newData.comments = newData.comments.split(',');
//         }
//     //si on a modifier l'image de Star
//         if (req.files && req.files.length > 0) {
//             filename = req.files[0].filename;
//             newData.photo = filename;
//         }
//         updated = await Star.findByIdAndUpdate({ _id: myid }, newData, { new: true })
//         filename = '';
//         res.status(200).send(updated)
//     }
//     catch (err) {
//         res.status(400).send(err)
//     }
// })
 // Update the star without checking for image
router.put('/StarUpdate/:id', upload.any('image') , async (req, res) => {
    try {
        const myid = req.params.id;
        let newData = req.body;
        if (newData.comments) {
        newData.comments = newData.comments.split(',');
        }
        if (req.files && req.files.length > 0) {
             filename = req.files[0].filename;
       
            newData.photo = filename;
                    }
        const updated = await Star.findByIdAndUpdate({ _id: myid }, newData, { new: true });
        filename = '';
        res.status(200).send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});
//add comment to a star 
router.post('/addCommentToStar/:ids', async (req, res) => {
    try {
        const starId = req.params.ids;  
        const commentData = req.body;     

        // Ensure commentData contains both username and message
        if (!commentData.username || !commentData.message) {
            return res.status(400).send('Both username and message are required for the comment');
        }

        const comment = new Comment(commentData);  
        const savedComment = await comment.save();  

        const star = await Star.findById(starId);  
        if (!star) {
            return res.status(404).send('Star not found');
        }
        if (!star.comments) {
            star.comments = [];
        }
        star.comments.push(savedComment._id); 
        await star.save(); 

        res.status(200).send(star);  // Respond with the updated Star
    } catch (error) {
        console.error("Error:", error);  // Log any errors that occur
        res.status(400).send({ message: 'Error adding comment to the star', error: error.message });
    }
});
router.delete('/:ids/deleteComment/:id', async (req,res)=>{
    try {
        const commentId = req.params.id;
        const starId = req.params.ids;
        const star = await Star.findById(starId); 
        if (!star) {
            return res.status(404).send('Star not found');
        }
        const commentIndex = star.comments.indexOf(commentId);
        if (commentIndex === -1) {
            return res.status(404).send('Comment not found in the star');
        }
        star.comments.splice(commentIndex, 1);
        await star.save();
        res.status(200).send(star);
    } catch (error) {
        console.error("Error:", error);
        res.status(400).send({ message: 'Error deleting comment from the star', error: error.message });
    }

})





module.exports = router;