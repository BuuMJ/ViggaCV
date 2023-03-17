const loginRouter = require("./login");
const homeRouter = require("./home");
const registerRouter = require("./register");
const profileRouter = require("./profile");
const { sendDataUser } = require("../util/data");
const { checkLogin } = require("../util/authorize");

function route(app) {
  app.use("/profile", profileRouter);

  app.use("/login", loginRouter);

  app.use("/register", registerRouter);

  app.use("/", sendDataUser, homeRouter);
}

module.exports = route;