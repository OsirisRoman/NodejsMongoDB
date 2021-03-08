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

/* app.use((req, res, next) => {
  User.findById('604328827c79c97a2d691a9c')
    .then(user => {
      req.user = new User(...Object.values(user), []);
      next();
    })
    .catch(err => {
      console.log(err);
      next();
    });
}); */

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
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
