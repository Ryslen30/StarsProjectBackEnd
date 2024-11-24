const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/addComment/:id', async (req, res) => { 

    try {
        data = req.body;
        comment = new Comment(data);
        savedUser = await comment.save();
        // myid = req.params.id;
        // star = await Star.findById({ _id: myid })
        res.status(200).send(savedUser);

    } catch (error) {
        res.status(400).send(error);

    }

})
router.delete('/deleteComment/:id', async (req, res) => {
    try {
        myid = req.params.id;
        comment = await Comment.findOneAndDelete({ _id: myid })
        res.status(200).send(comment);
    } catch (error) {
        res.status(400).send(error);

    }
})

router.get('/getComments/:id', async (req, res) => {
    try{
        myid=req.params.id;
        comment = await Comment.findById(myid);
        res.status(200).send(comment);
    }
    catch(err){
        res.status(400).send(err);
    }



});

module.exports = router;