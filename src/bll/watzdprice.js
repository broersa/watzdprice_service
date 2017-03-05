'use strict';

var conn = require('../dal/pgConnection.js');
var dal = require('../dal/watzdprice.js');
var MyError = require('../MyError.js');

var md5 = require('md5');
var urlify = require('urlify').create({
  spaces: '-',
  nonPrintable: '',
  trim: true
});

exports.updateProduct = function(product, callback) {
  var proid = generateId(product.name, product.url);
  conn.execute(function (err, client, done) {
    if (err) {
      return callback(new MyError('ERROR', 'updateProduct', 'Error', { product: product }, err));
    }
    dal.getProduct(client, proid, function (err, result) {
      if (err) {
        conn.rollback(client, done);
        return callback(new MyError('ERROR', 'updateProduct', 'Error', { product: product }, err));
      }
      if (result===null) {
        dal.addProduct(client, {
          proid: proid,
          proname: product.name,
          proshop: product.shop,
          probrand: product.brand,
          proean: product.ean,
          procategory: product.category,
          procreated: product.datetime,
          prolastupdate: product.datetime,
          proprice: product.price,
          prodescription: product.description,
          prourl: product.url,
          proimage: product.image
        }, function (err, result) {
          if (err) {
            conn.rollback(client, done);
            if (err.code === 'DUPLICATEKEY') {
              return callback(new MyError('DUPLICATEKEY', 'updateProduct', 'Duplicate key error', { product: product }, err));
            }
            return callback(new MyError('ERROR', 'updateProduct', 'Error', { product: product }, err));
          }
          dal.addHistory(client, {
            hisproduct: result,
            hisupdate: product.datetime,
            hisprice: product.price
          }, function (err) {
            if (err) {
              conn.rollback(client, done);
              if (err.code === 'DUPLICATEKEY') {
                return callback(new MyError('DUPLICATEKEY', 'updateProduct', 'Duplicate key error', { product: product }, err));
              }
              return callback(new MyError('ERROR', 'updateProduct', 'Error', { product: product }, err));
            }
            conn.commit(client, done);
            return callback(null, 'added');
          })
        });
      } else {
        var prokey = result.prokey;
        dal.updateProduct(client, {
          proean: product.ean,
          probrand: product.brand,
          procategory: product.category,
          prolastupdate: product.datetime,
          proprice: product.price,
          prodescription: product.description,
          proimage: product.image,
          proid: proid
        }, function (err) {
          if (err) {
            conn.rollback(client, done);
            return callback(new MyError('ERROR', 'updateProduct', 'Error', { product: product }, err));
          }
          dal.addHistory(client, {
            hisproduct: prokey,
            hisupdate: product.datetime,
            hisprice: product.price
          }, function (err) {
            if (err) {
              conn.rollback(client, done);
              if (err.code === 'DUPLICATEKEY') {
                return callback(new MyError('DUPLICATEKEY', 'updateProduct', 'Duplicate key error', { product: product }, err));
              }
              return callback(new MyError('ERROR', 'updateProduct', 'Error', { product: product }, err));
            }
            conn.commit(client, done);
            return callback(null, 'updated');
          })
        });
      }
    });
  });
}

exports.addShopLoadStats = function(shopLoadStats, callback) {
  conn.execute(function (err, client, done) {
    if (err) {
      return callback(new MyError('ERROR', 'addShopLoadStats', 'Error', { shopLoadStats: shopLoadStats }, err));
    }
    dal.addShopLoadStats(client, {
      shop: shopLoadStats.shop,
      start: shopLoadStats.start,
      end: shopLoadStats.end,
      added: shopLoadStats.added,
      updated: shopLoadStats.updated,
    }, function (err) {
      if (err) {
        conn.rollback(client, done);
        return callback(new MyError('ERROR', 'addShopLoadStats', 'Error', { shopLoadStats: shopLoadStats }, err));
      }
      conn.commit(client, done);
      return callback();
    });
  });
}

function generateId (name, url) {
  return ((urlify(name).toLowerCase()).substring(0,100)) + '-' + (md5(url).substring(0,3));
}
