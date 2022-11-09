import mongoose from "mongoose";

(async () => {
  try {
    const db = await mongoose.connect("mongodb+srv://Danilo:1983@cluster0.ceesysf.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to db:", db.connection.name);
  } catch (error) {
    console.error(error);
  }
})();
