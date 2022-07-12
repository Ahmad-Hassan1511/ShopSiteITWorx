const express = require('express');

const productRouter = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const debug = require('debug')('app:productRoutes');

function router(nav) {
  let products;

  const uri = 'mongodb+srv://shopappuser:P%40ssw0rd12345@shopapp.uvrszml.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'ShopDB';
  const productsColName = 'Product';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  };

  productRouter.route('/')
    .get((req, res) => {
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(
            uri,
            options
          );
          debug('connected correctly to server');
          const db = client.db(dbName);
          const col = await db.collection(productsColName);
          products = await col.find().toArray();
          res.render(
            'productListView',
            {
              title: 'Shop - Products',
              nav,
              products
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  productRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(
            uri,
            options
          );
          debug('connected correctly to server');
          const db = client.db(dbName);
          const col = await db.collection(productsColName);
          const product = await col.findOne({ _id: new ObjectId(id) });
          res.render(
            'productView',
            {
              title: 'Shop - Product Details',
              nav,
              product
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
