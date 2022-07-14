const express = require('express');

const productRouter = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const debug = require('debug')('app:productRoutes');

function router(nav) {
  productRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/login');
    }
  });

  let products;
  let username;

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  };

  productRouter.route('/')
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
          res.render(
            'productListView',
            {
              title: 'Shop - Products',
              nav,
              products,
              username
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    })
    .post((req, res) => {
      const {
        name, description, image, price
      } = req.body;

      (async function addProduct() {
        let client;
        try {
          client = await MongoClient.connect(
            'mongodb+srv://shopappuser:P%40ssw0rd12345@shopapp.uvrszml.mongodb.net/?retryWrites=true&w=majority',
            options
          );
          debug('Connected correctly to server');

          const db = client.db('ShopDB');
          const col = await db.collection('Product');

          const prod = {
            name, description, image, price
          };
          debug(prod);
          const results = await col.insertOne(prod);
          debug(results);
          res.redirect('/admin/view');
        } catch (err) {
          debug(err);
        }
      }());
    });

  productRouter.route('/:id')
    .get((req, res) => {
      username = req.user.name;
      const { id } = req.params;
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
          const product = await col.findOne({ _id: new ObjectId(id) });
          res.render(
            'productView',
            {
              title: 'Shop - Product Details',
              nav,
              product,
              username
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return productRouter;
}

module.exports = router;
