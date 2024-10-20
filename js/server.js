const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const { createConnection } =  require("myspl2/promise");

require("dotenv").config();

const app = express();
app.set("view engine", hbs);

require("handlebars-helpers")({
  handlebars: hbs.handlebars
});

//allow serving static files
app.use(express.static("public"));

//enable form processing
app.use(
  express.urlencoded({
    extended : false
  })
);

// wax-on set template inheritance type
wax.on(hbs.handlebars);
// wax-on set source path
wax.setLayoutPath("./views/layouts");

async function main() {
  const connection = await createConnection({
    "host" : process.env.DB_HOST,
    "user" : process.env.DB_USER,
    "database" : process.env.DB_DATABASE,
    "password" : process.env.DB_PASSWORD
  });

  app.get("/", (req, res) => {
    res.statusCode(418);
  })
};

main();

const serverPort = 3000;
app.listen(serverPort, () => {
  console.log(`Server has started on port ${serverPort}.`);
});