const express = require('express');
const router = express.Router();

const userModel = require('../models/User');

router.get('/',async (req,res) => {
         
    console.log("agya")
    const users = await userModel.find()
    .then(()=>{
        res.send(users);
    })
    .catch(err => {
        res.send(err);
    })
});

module.exports = router;