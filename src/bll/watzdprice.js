'use strict';

var conn = require('../dal/pgConnection.js');
var dal = require('../dal/watzdprice.js');

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
      return callback(err);
    }
    dal.getProduct(client, proid, function (err, result) {
      if (err) {
        conn.rollback(client, done);
        return callback(err);
      }
      if (result===null) {
        dal.addProduct(client, {
          proid: proid,
          proname: product.name,
          proshop: product.shop,
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
            return callback(err);
          }
          dal.addHistory(client, {
            hisproduct: result,
            hisupdate: product.datetime,
            hisprice: product.price
          }, function (err, result) {
            if (err) {
              conn.rollback(client, done);
              return callback(err);
            }
            conn.commit(client, done);
            return callback(null);
          })
        });
      } else {
        var prokey = result.prokey;
        dal.updateProduct(client, {
          proean: product.ean,
          procategory: product.category,
          prolastupdate: product.datetime,
          proprice: product.price,
          prodescription: product.description,
          proimage: product.image,
          proid: proid
        }, function (err) {
          if (err) {
            conn.rollback(client, done);
            return callback(err);
          }
          dal.addHistory(client, {
            hisproduct: prokey,
            hisupdate: product.datetime,
            hisprice: product.price
          }, function (err) {
            if (err) {
              conn.rollback(client, done);
              return callback(err);
            }
            conn.commit(client, done);
            return callback(null);
          })
        });
      }
    });
  });
}

function generateId (name, url) {
  return ((urlify(name).toLowerCase()).substring(0,100)) + '-' + (md5(url).substring(0,3));
}
