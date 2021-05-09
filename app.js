const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const adminRoutes = require("./routes/admin");
const publicRoutes = require("./routes/shop");
const errorControler = require("./controllers/error");

const mongoose = require("mongoose");
const User = require("./models/user");

const userCredentials = {
  name: "Osiris",
  email: "",
};

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findOne({ name: userCredentials.name })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

app.use("/admin", adminRoutes);
app.use(publicRoutes);

app.use(errorControler.get404);

const PORT = 3000;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/shop";

//Replace the following url connection by your own connection.
//Try to follow the specified format.
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return User.findOne();
  })
  .then(foundUser => {
    if (!foundUser) {
      const user = new User({
        name: userCredentials.name,
        email: userCredentials.email,
        cart: [],
      });
      user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
