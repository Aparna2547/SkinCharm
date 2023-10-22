const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.connect("mongodb+srv://AparnaManikandan:AparnaAtlas@cluster0.v9vocdt.mongodb.net/SkinCharm?retryWrites=true&w=majority"
     // process.env.MONGO_URL,
      //   {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // }
    );
    console.log('db connected with my project')
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
