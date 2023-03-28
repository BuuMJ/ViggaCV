const loginRouter = require("./login");
const homeRouter = require("./home");
const registerRouter = require("./register");
const profileRouter = require("./profile");
const { sendDataUser } = require("../util/data");
const { checkLogin } = require("../util/authorize");
const cvRouter = require("./cv");
const companyRouter = require("./company");
const companyprofileRouter = require("./companyprofile");

function route(app) {
  app.use("/companyprofile", checkLogin, companyprofileRouter);

  app.use("/company", checkLogin, companyRouter);

  app.use("/profile", checkLogin, profileRouter);

  app.use("/cv", cvRouter);

  app.use("/login", loginRouter);

  app.use("/register", registerRouter);

  app.use("/", sendDataUser, homeRouter);
}

module.exports = route;
