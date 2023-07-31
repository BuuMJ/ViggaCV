const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema({
  email: String,
});

const SubscribeModel = mongoose.model("subscribe", subscribeSchema);
module.exports = SubscribeModel;
