const { default: mongoose } = require("mongoose");

module.exports = {
  mutipleMongooseToObject: function (mongoose) {
    return mongoose.map((mongoose) => mongoose.toObject());
  },
  mongooseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },

  staffMongoseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};