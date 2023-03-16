const loginRouter = require("./login");
const homeRouter = require("./home");
const registerRouter = require("./register");
const { sendDataUser } = require("../util/data");
const { checkLogin } = require("../util/authorize");

function route(app) {
  app.use("/login", loginRouter);

  app.use("/register", registerRouter);

  app.use("/", sendDataUser, homeRouter);
}

module.exports = route;
