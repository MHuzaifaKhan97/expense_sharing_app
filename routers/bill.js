const express = require('express');
const router = express.Router();
// Models
const {Bill} = require('../models/bill');
const {User} = require('../models/user');

// Add Bill
 router. post("/addBill", async (req,res) => {

    const userList = await User.find().select("-passwordHash");
     
    if(!userList){
     res.status(500).json({
         success: false,
     });
    }
    req.body.billerList.push(req.body.user);
    let users = userList.filter((user) => req.body.billerList.includes(user.id));
    
    let amountPerHead = req.body.amount / users.length;

    users.forEach(async (user) =>{
       
        if(user.id == req.body.user){
            var newBill = new Bill({
                amount: req.body.amount - amountPerHead,
                type: "C",
                payFrom: user.id,
                payTo:req.body.user
            });
            await User.findByIdAndUpdate(user.id,{
                name: user.name,
                id:user.id,
                email: user.email,
                billItems: [...user.billItems, newBill],
            }, {new: true});
        await newBill.save();
        }else{
            var newBill = new Bill({
                amount:  amountPerHead,
                type: "D",
                payFrom: user.id,
                payTo:req.body.user
            });
            await User.findByIdAndUpdate(user.id,{
                name: user.name,
                id:user.id,
                email: user.email,
                billItems: [...user.billItems,newBill ],
            }, {new: true})
            await newBill.save();
        }
    });


    const updatedUsersList = await User.find().select("-passwordHash");  
    res.send({
        "user":updatedUsersList,
        "noOfUsers":users.length,
        "amountPerHead":amountPerHead,
    });

 })
 

// Add Bill
router. get("/", async (req,res) => {

    const billList = await Bill.find().populate("payFrom").populate("payTo");
     
    if(!billList){
     res.status(500).json({
         success: false,
     });
    }
    
    res.send(billList);

 })
 
 module.exports = router;