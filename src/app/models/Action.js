const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  companyid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  follow: {
    type: String,
    enum: ["folow", "following"],
    required: true,
  },
});

const ActionModel =  mongoose.model("action", actionSchema);
module.exports = ActionModel