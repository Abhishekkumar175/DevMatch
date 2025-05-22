const express = require('express');
const connectDB = require('./config/database');
const app= express();
const User = require('./models/user');

app.post("/signup", async (req, res) => {
    //creating a new instance of the user model
    
  try {
    await user.save();
    res.send("User Created");
  } catch(err){
    res.status(400).send("Error creating user: " + err.message);
  }
});



connectDB()
  .then(()=> {
    console.log('MongoDB connected...');
    app.listen(7777, () => {
      console.log('Server is running on port 7777....');
    });
  })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    }); 
 

