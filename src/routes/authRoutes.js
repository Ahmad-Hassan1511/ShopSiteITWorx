const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/register')
    .get((req, res) => {
      res.render('signUpView', {
        nav,
        title: 'Register'
      });
    });

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  };

  authRouter.route('/signUp')
    .post((req, res) => {
      const { name, email, password } = req.body;

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(
            'mongodb+srv://shopappuser:P%40ssw0rd12345@shopapp.uvrszml.mongodb.net/?retryWrites=true&w=majority',
            options
          );
          debug('Connected correctly to server');

          const db = client.db('ShopDB');
          const col = await db.collection('User');
          const admin = false;

          const user = {
            name, email, password, admin
          };
          debug(user);
          const results = await col.insertOne(user);
          debug(results);
          req.login(user, () => {
            res.redirect('/product');
          });
        } catch (err) {
          debug(err);
        }
      }());
    });

  authRouter.route('/logout')
    .get((req, res) => {
      req.logOut(() => {
        res.redirect('/');
      });
    });

  authRouter.route('/login')
    .get((req, res) => {
      res.render('loginView', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/product',
      failureRedirect: '/'
    }));
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/login');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;
