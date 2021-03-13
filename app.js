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

app.use((req, res, next) => {
  User.findById('60496d9ce44dc026f05324e1')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

app.use('/admin', adminRoutes);
app.use(publicRoutes);

app.use(errorControler.get404);

const PORT = 3000;

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
