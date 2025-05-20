const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect( 
       // 'mongodb+srv://abhishekkumar345ssm:WbAjCjfUECr5eUJy@namastenode.o68kn.mongodb.net/'
    );
};

module.exports = connectDB;
