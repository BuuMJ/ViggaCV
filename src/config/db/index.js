const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://duoc6694:jJw8rmJmvkZzgIna@viggacv.qxmduwf.mongodb.net/ViggaCV"
    );
    console.log("Truy cập DB thành công!");
  } catch (error) {
    console.log("Truy cập DB thất bại!!!!");
  }
}

module.exports = { connect };
