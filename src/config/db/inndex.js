const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://QuyNPGCS190822:Q8no0QKAGmvJD4Em@cluster0.qnytwdq.mongodb.net/Top-Up"
    );
    console.log("Truy cập DB thành công!");
  } catch (error) {
    console.log("Truy cập DB thất bại!!!!");
  }
}

module.exports = { connect };
