const path = require("path");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const express = require("express");
const app = express();
const port = 3000;
const route = require("./routes");
const db = require("./config/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const paypal = require("paypal-rest-sdk");
const helpers = require("handlebars-helpers");
const MongoDBStore = require("connect-mongodb-session")(session);
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
// Passport Configuration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AV47xaGE8MDMMRXmXaYQzBESVzCGF3sigEaJpopAWgwJJB4XpHIyQggJv5X6qeX6Ie5QAlGUjWAs-eq4",
  client_secret:
    "EPmovspX-8kl0V--Q1p0Aup3ipVkGU3n16CvR4L3DsSFhV1SoNwcYYIsL-fAxtKU1LBS31CZQgDoASPa",
});

const hbs = handlebars.create({
  helpers: require("./util/helpers"),
  extname: ".hbs",
});

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// method
app.use(methodOverride("_method"));

// HTTP logger
app.use(morgan("combined"));

// use middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//use cookie parser
app.use(cookieParser());

const store = new MongoDBStore({
  uri: "mongodb+srv://duoc6694:jJw8rmJmvkZzgIna@viggacv.qxmduwf.mongodb.net/ViggaCV",
  collection: "sessions",
});
//use express-session
app.use(
  session({
    secret: "pw",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Thời gian sống 1 ngày (86400000 miliseconds)
    },
  })
);

//connect DB
db.connect();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("uploads"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));
console.log(path.join(__dirname, "resources/views"));

//route innit
route(app);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
