const express = require("express");
const { Sequelize } = require("sequelize");
const config = require("./config/config.json").development;
const cors = require("cors");
const usersRoutes = require("./routes/users");
const storesRoutes = require("./routes/stores");
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const addressesRouter = require("./routes/addresses");

const app = express();
app.use(express.json());
app.use(cors());
// app.options("*", cors());
const port = 5123;

app.use("/users", usersRoutes);
app.use("/stores", storesRoutes);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);
app.use("/addresses", addressesRouter);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Uspesno povezivanje sa bazom podataka.");
  })
  .catch((error) => {
    console.error("Greska prilikom povezivanja sa bazom podataka:", error);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
