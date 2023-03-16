const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars')
const express = require('express');
const app = express();
const port = 3000;
const route = require('./routes')
const hbs = handlebars.create({
    // helpers: require("./util/helpers"),
    extname: ".hbs",
  });


  app.use(express.static(path.join(__dirname, 'public')));
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "resources/views"));
  console.log(path.join(__dirname, "resources/views"))

//route innit
route(app);

app.listen(port, () => 
    console.log(`App listening at http://localhost:${port}`))