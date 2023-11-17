const express = require('express');
const router = express.Router();
// Models
const {User} = require('../models/user');
// Import BcryptJS
const bcrypt = require('bcryptjs');
// Import JWT
const jwt = require('jsonwebtoken');

// Get all users
router.get("/", async (req, res) => {

    const userList = await User.find().select("-passwordHash");
     
    if(!userList){
     res.status(500).json({
         success: false,
     });
    }
    res.send(userList);
 })
//  // Get user minimum details
// router.get("/basicDetails", async (req, res) => {

//     const userList = await User.find().select("name email phone");
     
//     if(!userList){
//      res.status(500).json({
//          success: false,
//      });
//     }
//     res.send(userList);
//  })
//  Get single user
 router.get("/:id", async (req, res) => {

    const user = await User.findById(req.params.id).populate("billItems")
    if(!user){
     res.status(500).json({
         success: false,
         message:"User not found"
     });
    }
    let totalCredit = 0;
    let totalDebit = 0;
    user.billItems.forEach((bill) => {
        if(bill.type == "D"){
            totalDebit += bill.amount;
        }else{
            totalCredit += bill.amount;
        }
    })
    res.send({
        "user":user,
        "totalDebit": totalDebit,
        "totalCredit":totalCredit,
    })
 })

 // Register User
 router. post("/register", async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    user = await user.save();
    if(!user){
       return res.status(400).send({
            message:"User can not be created"
        })
    }
    res.send(user);
 })
 // Login User
 router. post("/login", async (req,res) => {
   const user = await User.findOne({
    email:req.body.email
   });
   const secret = process.env.SECRET;
   if(!user){
    res.status(400).send({
        success:false,
        message:"User not found"
    })
   }
   if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
    const token = jwt.sign({
        userId:user.id,
        isAdmin:user.isAdmin,
    },
    secret,
    // 1d = 1 day, 1w = 1 week
    {expiresIn: '1d'}
    );
    res.status(200).send({
        email:user.email,
        token:token,
    })
   }else{
    res.status(200).send("Username or password is incorrect")
   }
 })

  // Get user count
router.get('/get/count', async (req,res) => {
    const userCount = await User.countDocuments();
    if(!userCount){
        res.status(400).send({success:false, message:"No User found"})
    }
    res.status(200).send({success:true, userCount:userCount})

})
 
//  Delete user
router.delete("/:id", async (req,res) => {
    let user = await User.findByIdAndRemove(req.params.id)
    if(user){
     res.status(200).send({
         success: true,
         message:"User has been deleted successfully"
     })
    }else{
     res.status(404).send({
         success:false,
         message:"User not found"
     })
    }
  })
 
 module.exports = router;