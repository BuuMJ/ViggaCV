const loginRouter = require("./login");
const homeRouter = require("./home");
const registerRouter = require("./register");
const profileRouter = require("./profile");
const { sendDataUser } = require("../util/data");
const { checkLogin } = require("../util/authorize");
const cvRouter = require("./cv");
const companyRouter = require("./company");

function route(app) {
  app.use("/company", checkLogin, companyRouter);

  app.use("/profile", checkLogin, profileRouter);

  app.use("/cv", checkLogin, cvRouter);

  app.use("/login", loginRouter);

  app.use("/register", registerRouter);

  app.use("/", sendDataUser, homeRouter);
}

module.exports = route;
