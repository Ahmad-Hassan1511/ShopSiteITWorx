const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const appName = 'My Site';
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'shopApp' }));

require('./src/config/passport')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/home', title: 'Home' },
  { link: '/product', title: 'All Products' },
  { link: '/admin', title: 'Admin Dashboard' }
];

const productRouter = require('./src/routes/productRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/product', productRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

let username;
let displayRegister;
let displayUser;

app.get('/home', (req, res) => {
  if (req.user) {
    username = req.user.name;
    displayRegister = 'none';
    displayUser = 'block';
  } else {
    displayRegister = 'block';
    displayUser = 'none';
  }

  res.render(
    'index',
    {
      title: 'Shop Homepage',
      nav,
      username,
      displayRegister,
      displayUser
    }
  );
});

app.get('/', (req, res) => {
  if (req.user) {
    username = req.user.name;
    displayRegister = 'none';
    displayUser = 'block';
  } else {
    displayRegister = 'block';
    displayUser = 'none';
  }
  res.render(
    'index',
    {
      title: 'Shop Homepage',
      nav,
      username,
      displayRegister,
      displayUser
    }
  );
});

// booting app
debug('booting %o', appName);

app.listen(port, () => {
  // console.log(`listening on port ${chalk.green('3000')}`);
  debug(`listening on port ${chalk.green(port)}`);
});
