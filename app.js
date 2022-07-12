const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const appName = 'My Site';
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/home', title: 'Home' },
  { link: '/products', title: 'All Products' }
];

const productRouter = require('./src/routes/productRoutes')(nav);

app.use('/products', productRouter);

app.get('/home', (req, res) => {
  res.render(
    'index',
    {
      title: 'Shop Homepage',
      nav
    }
  );
});

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      title: 'Shop Homepage',
      nav
    }
  );
});

// booting app
debug('booting %o', appName);

app.listen(port, () => {
  // console.log(`listening on port ${chalk.green('3000')}`);
  debug(`listening on port ${chalk.green(port)}`);
});
