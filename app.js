const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/shop');
const errorControler = require('./controllers/error');

const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//Before initializing the project, comment the
//following section and run the server. This will
// make the server to create a user for the first time.
//If case you want to specify your own user parameters
//you could modify these on lines 67 and 68 of this file.
//After that stop the server and assign the user ID
//to the constant userID variable to make te server
//run without problems. Finally restart the server
//and from now on it will run ok.
/////////////////////////////////////////////////
app.use((req, res, next) => {
  const userID = 'Your UserID HERE';
  User.findById(userID)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      next();
    });
});
/////////////////////////////////////////////////

app.use('/admin', adminRoutes);
app.use(publicRoutes);

app.use(errorControler.get404);

const PORT = 3000;

//Replace the following url connection by your own connection.
//Try to follow the specified format.
mongoose
  .connect(
    `mongodb+srv://${encodeURIComponent('Osiris')}:${encodeURIComponent(
      '1724771645'
    )}@cluster0.7jlvx.mongodb.net/shop?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    return User.findOne();
  })
  .then(foundUser => {
    if (!foundUser) {
      const user = new User({
        name: 'Osiris',
        email: 'osirisr1994@gmail.com',
        cart: [],
      });
      user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
