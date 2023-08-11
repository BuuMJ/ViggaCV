const { default: mongoose } = require("mongoose");

module.exports = {
  mutipleMongooseToObject: function (mongoose) {
    return mongoose.map((mongoose) => mongoose.toObject());
  },
  mutipleJobToJSON: function (mongoose) {
    return mongoose.map((mongoose) => mongoose.toJSON());
  },
  mongooseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },

  staffMongoseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
