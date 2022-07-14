const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

function router(nav) {
  adminRouter.use((req, res, next) => {
    if (req.user?.admin) {
      next();
    } else {
      res.redirect('/auth/login');
    }
  });

  let username;
  let products;

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  };

  adminRouter.route('/')
    .get((req, res) => {
      username = req.user.name;
      res.render('adminView', {
        nav,
        title: 'Admin - Dashboard',
        username
      });
    });

  adminRouter.route('/view')
    .get((req, res) => {
      username = req.user.name;
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(
            'mongodb+srv://shopappuser:P%40ssw0rd12345@shopapp.uvrszml.mongodb.net/?retryWrites=true&w=majority',
            options
          );
          debug('connected correctly to server');
          const db = client.db('ShopDB');
          const col = await db.collection('Product');
          products = await col.find().toArray();
          res.render('adminProdListView', {
            nav,
            title: 'Admin - All Products',
            username,
            products
          });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  return adminRouter;
}

module.exports = router;
