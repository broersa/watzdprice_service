'use strict';

var watzdprice = require('../bll/watzdprice.js');
var MyError = require('../MyError.js');

module.exports.updateproductPUT = function updateproductPUT (req, res, next) {
  var product = {
    name: req.swagger.params.product.value.name,
    shop: req.swagger.params.product.value.shop,
    brand: req.swagger.params.product.value.brand,
    ean: req.swagger.params.product.value.eancode,
    category: req.swagger.params.product.value.category,
    datetime: req.swagger.params.product.value.datetime,
    price: req.swagger.params.product.value.price,
    description: req.swagger.params.product.value.description,
    url: req.swagger.params.product.value.url,
    image: req.swagger.params.product.value.image
  };
  watzdprice.updateProduct(product , function (err, result) {
    if (err) {
      if (err.code === 'DUPLICATEKEY') {
        res.statusCode = 400;
        res.end(JSON.stringify({code: 'DUPLICATEKEY', message: 'Duplicate key error', fields: JSON.stringify(product) }));
      }
      return next(new MyError('ERROR', 'updateproduct', 'Error', { product: product }, err));
    }
    res.statusCode = 200;
    res.end(JSON.stringify({operation: result}));
  });
};

module.exports.addshoploadstatsPOST = function addshoploadstatsPOST (req, res, next) {
  var shopLoadStats = {
    shop: req.swagger.params.shoploadstats.value.shop,
    start: req.swagger.params.shoploadstats.value.start,
    end: req.swagger.params.shoploadstats.value.end,
    added: req.swagger.params.shoploadstats.value.added,
    updated: req.swagger.params.shoploadstats.value.updated
  };
  watzdprice.addShopLoadStats(shopLoadStats, function (err) {
    if (err) {
      return next(new MyError('ERROR', 'updateproduct', 'Error', { shopLoadStats: shopLoadStats }, err));
    }
    res.statusCode = 204;
    res.end();
  });
};
