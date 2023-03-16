const loginRouter = require("./login");
const homeRouter = require("./home");
const registerRouter = require("./register");

function route(app) {
  app.use("/login", loginRouter);

  app.use("/register", registerRouter);

  app.use("/", homeRouter);
}

module.exports = route;
