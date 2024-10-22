const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const { createConnection } = require("mysql2/promise");

require("dotenv").config();

const app = express();
app.set("view engine", "hbs");

require("handlebars-helpers")({
  handlebars: hbs.handlebars
});

// handlebars-helper not working?
hbs.registerHelper('if_eq', function(a, b, opts) {
  if(a == b)
      return opts.fn(this);
  else
      return opts.inverse(this);
});

//allow serving static files
app.use(express.static("public"));

//enable form processing
app.use(
  express.urlencoded({
    extended: false
  })
);

// wax-on set template inheritance type
wax.on(hbs.handlebars);
// wax-on set source path
wax.setLayoutPath("./views/layouts");

function dateToMySqlDate(date) {
  if(!date || isNaN(date.getTime())) return undefined;
  return `${date.getFullYear()}-` +
         `${String(date.getMonth()+1).padStart(2,'0')}-` +
         `${String(date.getDate()).padStart(2,'0')}`;
}

function dateToMySqlDatetime(date) {
  return `${dateToMySqlDate(date)} `+
         `${String(date.getHours()).padStart(2,'0')}:` +
         `${String(date.getMinutes()).padStart(2,'0')}:` +
         `${String(date.getSeconds()).padStart(2,'0')}`;
}

function dateToHtmlDate(date) {
  if(!date || isNaN(date.getTime())) return undefined;
  return `${date.getFullYear()}` +
         `-${String(date.getMonth()).padStart(2, 0)}` +
         `-${String(date.getDate()).padStart(2,0)}`;
}

function dateToHtmlDatetime(date) {
  return `${dateToHtmlDate(date)}` +
         `T${String(date.getHours()).padStart(2,'0')}` + 
         `:${String(date.getMinutes()).padStart(2,'0')}`;
}

async function main() {
  const connection = await createConnection({
    "host": process.env.DB_HOST,
    "user": process.env.DB_USER,
    "database": process.env.DB_DATABASE,
    "password": process.env.DB_PASSWORD
  });

  app.get("/", (req, res) => {
    res.redirect("/home");
  });

  app.get("/home", (req, res) => {
    res.render("home");
  });

  app.get("/read", async (req, res) => {
    const [orders] = await connection.execute(`
      SELECT order_id,
              posted,
              complete_by,
              completed_at,
              smiths.name AS smithname,
              templates.name AS templatename,
              materials.name AS materialname,
              customer_id,
              remarks
      FROM orders 
      JOIN smiths ON orders.smith_id = smiths.smith_id
      JOIN templates ON orders.template_id = templates.template_id
      JOIN materials ON orders.material_id = materials.material_id;
    `);
    res.render("read", {
      "orders": orders
    });
  });

  app.get("/customers", async (req, res) => {
    const [customers] = await connection.execute(`
      SELECT *
      FROM customers
    `);
    res.render("customers", {
      "customers" : customers
    });
  });

  app.get("/create", async (req, res) => {
    const [materials] = await connection.execute(
      `
      SELECT 
             material_id,
             name
      FROM materials;
      `
    );

    const [templates] = await connection.execute(
      `
      SELECT 
             template_id,
             name
      FROM templates;
      `
    );

    const data = {
      "materials": materials,
      "templates": templates
    };
    res.render("create", data);
  });

  app.post("/create", async (req, res) => {
    const {name, address, email, template_id, material_id, remarks} = req.body;
    let {contact} = req.body;
    const numbers = contact.match(/\d+/g);
    contact = numbers.join('');

    const [customers] = await connection.execute(`
       SELECT customer_id, email
       From customers
       WHERE email = "${email}";
    `);

    let customerId;

    if(customers.length < 1) {
      const query = `
        INSERT INTO customers (name, contact, email, address)
        VALUES (?, ?, ?, ?);
      `;

      const [result] = 
        await connection.execute(query, [name, contact, email, address]);
      customerId =  result.insertId;
      //  await 
    } else { // email must be unique
      customerId = customers[0].customer_id;
    }

    const [smiths] = await connection.execute(`
      SELECT smith_id
      FROM smiths;
    `);
    
    const smith_id = smiths[Math.floor(Math.random() * smiths.length)].smith_id;

    const insertQuery = `
      INSERT INTO orders (posted, complete_by,
                          customer_id, smith_id, template_id, material_id,
                          remarks)
      VALUES(?, ?, ?, ?, ?, ?, ?);
    `;

    await connection.execute(insertQuery,
      [ dateToMySqlDatetime(new Date()),
        dateToMySqlDate(new Date(Date.now() + 2592000000)),
        customerId, smith_id, template_id, material_id, remarks
      ]);

    res.redirect("/read");
  });

  app.get("/update", async (req, res)=>{
    const [orders] = await connection.execute(`
      SELECT order_id
      FROM orders
    ;`);

    const {order_id} = req.query;

    const data = { "orders" : orders };

    if(order_id) {
      const [order] = (await connection.execute(`
        SELECT *
        FROM orders
        WHERE order_id = ${order_id}
      ;`))[0];

      order.posted = dateToHtmlDatetime(order.posted);
      order.complete_by = dateToHtmlDate(order.complete_by);
      if(order.completed_at) {
        order.completed_at = dateToHtmlDatetime(order.completed_at);
      } else {
        order.completed_at = dateToHtmlDatetime(new Date(0));
      }

      data.order = order;
      const [smiths] = await connection.execute(`
        SELECT smith_id, name
        FROM smiths
      ;`);
      const [templates] = await connection.execute(`
        SELECT template_id, name
        FROM templates
      ;`);
      const [materials] = await connection.execute(`
        SELECT material_id, name
        FROM materials
      ;`);
      const [customers] = await connection.execute(`
        SELECT customer_id, name
        FROM customers
      ;`);

      data.selectedOrder = Number(order_id);
      data.smiths = smiths;
      data.templates = templates;
      data.materials = materials;
      data.customers = customers;
      console.log(data);
      res.render("update_post", data);
      return;
    }
    res.render("update_get", data);
  });

  app.post("/update", async (req, res) => {
    const { complete_by, smith_id, template_id, order_id,
            material_id, customer_id, remarks } = req.body;
    const completed_at =
      req.body.completed_at.length == 0 ? null : req.body.completed_at;

    const query = `UPDATE ORDERS 
                   SET complete_by = ?, smith_id = ?, template_id = ?,
                       material_id = ?, customer_id = ?, completed_at = ?,
                       remarks = ?
                   WHERE order_id = ?;`;
    const values = [
      dateToMySqlDate(new Date(complete_by)), smith_id, 
      template_id, material_id, customer_id, 
      completed_at ? dateToMySqlDatetime(new Date(completed_at)): null,
      remarks, order_id
    ];
    await connection.execute(query, values);
    res.redirect("../read");
  });

  app.get("/delete/:order_id", async (req, res) => {
    const order_id = req.params.order_id;
    const [order] = (await connection.execute(`
      SELECT order_id,
              posted,
              complete_by,
              completed_at,
              smiths.name AS smithname,
              templates.name AS templatename,
              materials.name AS materialname,
              customer_id,
              remarks
      FROM orders 
      JOIN smiths ON orders.smith_id = smiths.smith_id
      JOIN templates ON orders.template_id = templates.template_id
      JOIN materials ON orders.material_id = materials.material_id
      WHERE order_id = ${order_id};
    `))[0];

    res.render("delete", {"order" : order});
  });

  app.post("/delete/:order_id", async (req, res) => {
    const order_id = req.params.order_id;
    const query = `
      DELETE FROM orders
      WHERE order_id = ?
    ;`;
    await connection.execute(query, [order_id]);
    res.redirect("../read");
  });
};

main();

const serverPort = 3000;
app.listen(serverPort, () => {
  console.log(`Server has started on port ${serverPort}.`);
});