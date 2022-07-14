const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient, ServerApiVersion } = require('mongodb');
const debug = require('debug')('app:local.strategy');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
};

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(
          'mongodb+srv://shopappuser:P%40ssw0rd12345@shopapp.uvrszml.mongodb.net/?retryWrites=true&w=majority',
          options
        );
        debug('Connected correctly to server');

        const db = client.db('ShopDB');
        const col = await db.collection('User');

        const user = await col.findOne({ email });

        if (user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        debug(err.stack);
      }
      // Close connection
      client.close();
    }());
  }));
};
